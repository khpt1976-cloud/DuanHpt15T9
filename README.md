# DuanHpt9t9 + Botpress V12 Integration

Tích hợp hoàn chỉnh giữa hệ thống quản lý xây dựng DuanHpt9t9 (Next.js) và nền tảng chatbot Botpress V12 qua Docker.

## 🚀 Khởi động nhanh (Portable Deployment)

```bash
# Clone repository
git clone https://github.com/khpt1976-cloud/DuanHpt9t9.git
cd DuanHpt9t9

# Khởi động toàn bộ hệ thống với 1 lệnh
./start.sh
```

## 📋 Yêu cầu hệ thống

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM khả dụng
- 10GB dung lượng ổ cứng

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐
│   DuanHpt9t9    │    │   Botpress V12  │
│   (Next.js)     │◄──►│   (Chatbot)     │
│   Port: 12000   │    │   Port: 12001   │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
              Docker Network
```

## 🔧 Cấu hình

### Environment Variables

Chỉnh sửa file `.env` để cấu hình:

```env
# DuanHpt9t9 Configuration
NEXTAUTH_URL=http://localhost:12000
NEXTAUTH_SECRET=your-production-secret-key
NEXT_PUBLIC_BOTPRESS_URL=http://localhost:12001

# Botpress Configuration
EXTERNAL_URL=http://localhost:12001
DUAN_HPT_URL=http://duan_hpt:3000
```

### Ports

- **12000**: DuanHpt9t9 Construction Management System
- **12001**: Botpress V12 Chatbot Platform

## 🌐 Truy cập hệ thống

### DuanHpt9t9 (Construction Management)
- **Trang chủ**: http://localhost:12000
- **Admin Panel**: http://localhost:12000/admin
- **AdminBot Integration**: http://localhost:12000/admin/adminbot

### Botpress V12 (Chatbot Platform)
- **Chatbot Interface**: http://localhost:12001
- **Admin Panel**: http://localhost:12001/admin

## 🔗 Tích hợp AdminBot

Hệ thống tích hợp seamless giữa DuanHpt9t9 và Botpress:

1. **Login** vào DuanHpt9t9
2. **Truy cập Admin Panel** → `/admin`
3. **Click AdminBot** trong sidebar
4. **Giao diện Botpress** được nhúng trực tiếp

### Tính năng AdminBot

- ✅ Kiểm tra trạng thái Botpress real-time
- ✅ Mở Admin Panel Botpress trong tab mới
- ✅ Giao diện Botpress nhúng trong DuanHpt9t9
- ✅ Thao tác nhanh và quản lý tập trung

## 🐳 Docker Commands

```bash
# Khởi động services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Rebuild và khởi động
docker-compose up --build -d

# Cleanup hoàn toàn
docker-compose down -v
docker system prune -f
```

## 📁 Cấu trúc thư mục

```
/workspace/
├── DuanHpt9t9/                 # Next.js Construction Management
│   ├── Dockerfile              # Multi-stage build
│   ├── app/admin/adminbot/     # AdminBot integration page
│   └── ...
├── BotpressV12/                # Botpress V12 Chatbot
│   ├── Dockerfile              # Multi-stage build
│   └── ...
├── docker-compose.yml          # Services orchestration
├── .env                        # Environment variables
├── start.sh                    # Deployment script
└── README.md                   # Documentation
```

## 🔒 Bảo mật

- Container chạy với non-root user
- Network isolation giữa services
- Environment variables được bảo vệ
- CORS được cấu hình cho tích hợp

## 🚨 Troubleshooting

### Service không khởi động
```bash
# Kiểm tra logs
docker-compose logs duan_hpt
docker-compose logs botpress

# Kiểm tra ports
netstat -tulpn | grep :12000
netstat -tulpn | grep :12001
```

### Botpress không kết nối
```bash
# Kiểm tra network
docker network ls
docker network inspect workspace_app_network

# Test connectivity
docker exec duan_hpt_container ping botpress
```

### Database issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

## 📞 Hỗ trợ

- **GitHub Issues**: [DuanHpt9t9 Issues](https://github.com/khpt1976-cloud/DuanHpt9t9/issues)
- **Email**: khpt1976@example.com

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Portable Deployment** - Chỉ cần 1 lệnh `./start.sh` để khởi động toàn bộ hệ thống! 🚀