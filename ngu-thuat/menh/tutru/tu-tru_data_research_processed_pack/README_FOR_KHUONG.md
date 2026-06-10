# Tóm tắt xử lý cho Khương - Data Tứ Trụ

## Kết quả nghiên cứu đã nhận
Báo cáo gom được 55 nguồn ứng viên.
Phân loại sơ bộ:
- 16 nguồn phù hợp hướng engine / lịch pháp / kiểm chứng.
- 26 nguồn phù hợp làm reference.
- 18 nguồn cần kiểm tra bản quyền/giấy phép trước khi dùng trong sản phẩm.
- 5 nguồn nên loại bỏ.

## Cách hiểu đúng
Đây mới là kho nguồn ứng viên, chưa phải Knowledge Base sạch.
Không được đưa thẳng toàn bộ vào app.
Việc tiếp theo là lọc, chuẩn hóa, gắn license, rồi mới seed vào module.

## Ưu tiên xử lý
1. Tách engine-validation trước:
   - lịch pháp
   - tiết khí
   - Can Chi
   - chuyển đổi lịch
   - kiểm tra thư viện tính toán
2. Tách rule core tối thiểu:
   - Ngũ hành
   - Thiên Can / Địa Chi
   - Tàng Can
   - Thập Thần
   - Hợp / Xung cơ bản
3. Đưa sách cổ vào tầng Reference trước, chưa dùng để kết luận tự động.
4. Tất cả nguồn bản quyền không rõ chỉ để nội bộ, chưa hiển thị public.

## Giao dev / researcher tiếp theo
Nhiệm vụ tiếp theo không phải gom thêm nguồn lan man, mà là biến báo cáo này thành thư mục data seed có kiểm soát:
- source_inventory.json
- glossary_seed.json
- rules_candidate.json
- license_review.md
- topic_map.md
- data_filter_rules.md

## Cấm làm ngay
- Không viết luận giải người dùng từ nguồn thô.
- Không copy dài nội dung sách.
- Không tự gắn nguồn là approved_core nếu chưa được kiểm duyệt.
- Không đưa AI tự luận ngoài rule/data đã duyệt.
