# Plant-doctor
# git add . // Thêm code 
# git commit -m "......" // Lưu code 
# git push origin main // đẩy code lên GitHub
# git pull origin main // lấy code mới 
# git remote -v // Kiểm tra repository
# git status // Kiểm tra trạng thái
# git checkout -b development // Câu lệnh tạo nhánh development 
# git push -u origin development // lần cập nhật sau chỉ cần // git push origin development
# git checkout main // Chuyển về lại nhánh main // Git pull origin main ( Cập nhập code mới nhất)
# git merge development ( Hợp nhất code từ development vào main) // Git push origin main ( Đẩy code lên nhánh main)
# run // Back End : Python run.py

## Deploy lên Vercel

Repo dùng Vercel Services để build Frontend và Backend riêng nhưng phục vụ chung một domain.
Giữ Root Directory của Vercel ở thư mục gốc repo để Vercel đọc `vercel.json`.
Các request `/api/...` được chuyển tới Flask; những đường dẫn còn lại được chuyển tới Vite.

Thêm các biến môi trường production theo mẫu [`.env.example`](./.env.example) trong Vercel Project Settings. Thay toàn bộ giá trị mẫu, đặc biệt là `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, thông tin SMTP và `FRONTEND_URL`.