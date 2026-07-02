# phamthivan.vn - Website thương hiệu cá nhân + Admin Blog

Bộ source Next.js có giao diện admin giống WordPress cơ bản tại:

`/admin`

## 1. Cài lên GitHub
Upload toàn bộ source này vào repo:

`enterbuyorder-oss/phamthivan-vn`

## 2. Deploy Vercel
Vào Vercel → project `phamthivan-vn` → deploy.

Framework Preset: Next.js

## 3. Biến môi trường cần cài trong Vercel
Vào Vercel → Project → Settings → Environment Variables, thêm:

```env
ADMIN_PASSWORD=mat-khau-admin-manh
GITHUB_TOKEN=github_pat_xxxxxxxxx
GITHUB_OWNER=enterbuyorder-oss
GITHUB_REPO=phamthivan-vn
GITHUB_BRANCH=main
```

## 4. GitHub Token
Tạo Fine-grained Personal Access Token trên GitHub với quyền:

- Repository: `phamthivan-vn`
- Permissions → Contents: Read and Write
- Metadata: Read

Token này chỉ lưu ở Vercel Environment Variables, không đưa vào code.

## 5. Cách viết bài
Vào:

`https://phamthivan.vn/admin`

Nhập mật khẩu ADMIN_PASSWORD, sau đó:
- Tạo bài mới
- Sửa Title SEO
- Sửa Slug
- Sửa Meta Description
- Chọn chuyên mục
- Viết mở bài, các H2, kết luận
- Bấm “Lưu lên GitHub”

Sau khi lưu, Vercel sẽ tự deploy lại trong vài phút.

## 6. Lưu ý bảo mật
- Không chia sẻ ADMIN_PASSWORD.
- Không commit GITHUB_TOKEN lên GitHub.
- Nên đặt mật khẩu mạnh.
- Sau này có thể nâng cấp đăng nhập Google hoặc tài khoản riêng.
Update deployment
