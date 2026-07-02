import { NextResponse } from "next/server";
import localData from "@/content/posts.json";

export const dynamic = "force-dynamic";

const FILE_PATH = "content/posts.json";

function getConfig() {
  return {
    adminPassword: process.env.ADMIN_PASSWORD,
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER || "enterbuyorder-oss",
    repo: process.env.GITHUB_REPO || "phamthivan-vn",
    branch: process.env.GITHUB_BRANCH || "main"
  };
}

function unauthorized() {
  return NextResponse.json({ error: "Sai mật khẩu admin." }, { status: 401 });
}

async function readBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function checkPassword(password?: string | null) {
  const { adminPassword } = getConfig();
  if (!adminPassword) return false;
  return password === adminPassword;
}

function decodeBase64Unicode(input: string) {
  return Buffer.from(input, "base64").toString("utf-8");
}

function encodeBase64Unicode(input: string) {
  return Buffer.from(input, "utf-8").toString("base64");
}

async function getGithubFile() {
  const { token, owner, repo, branch } = getConfig();
  if (!token) {
    return {
      json: localData,
      sha: null,
      fromLocal: true
    };
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      cache: "no-store"
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không đọc được file từ GitHub: ${res.status} ${text}`);
  }

  const payload = await res.json();
  const content = decodeBase64Unicode(payload.content);
  return {
    json: JSON.parse(content),
    sha: payload.sha as string,
    fromLocal: false
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password") || req.headers.get("x-admin-password");

  if (!checkPassword(password)) return unauthorized();

  try {
    const file = await getGithubFile();
    return NextResponse.json({
      data: file.json,
      fromLocal: file.fromLocal,
      warning: file.fromLocal
        ? "Chưa có GITHUB_TOKEN. Admin chỉ xem được dữ liệu mẫu local, chưa lưu được lên GitHub."
        : null
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await readBody(req);
  const password = body.password || req.headers.get("x-admin-password");

  if (!checkPassword(password)) return unauthorized();

  const { token, owner, repo, branch } = getConfig();
  if (!token) {
    return NextResponse.json(
      { error: "Thiếu GITHUB_TOKEN trong Vercel Environment Variables nên chưa thể lưu bài lên GitHub." },
      { status: 500 }
    );
  }

  if (!body.data || !Array.isArray(body.data.posts) || !Array.isArray(body.data.categories)) {
    return NextResponse.json({ error: "Dữ liệu bài viết không hợp lệ." }, { status: 400 });
  }

  try {
    const current = await getGithubFile();
    if (!current.sha) throw new Error("Không lấy được SHA file content/posts.json.");

    const content = JSON.stringify(body.data, null, 2);
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: JSON.stringify({
        message: `Cập nhật blog từ admin: ${new Date().toISOString()}`,
        content: encodeBase64Unicode(content),
        sha: current.sha,
        branch
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Không lưu được lên GitHub: ${res.status} ${text}`);
    }

    return NextResponse.json({
      ok: true,
      message: "Đã lưu bài viết lên GitHub. Vercel sẽ tự deploy lại sau vài phút."
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 }
    );
  }
}
