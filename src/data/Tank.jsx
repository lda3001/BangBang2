const tanks = [
  {
    id: 'kyuubi',
    img: 'naruto.png',
    icon: '🦊',
    name: 'Kyuubi',
    role: 'Cơ động',
    cost: 2,
  },
  {
    id: 'pikachu',
    img: 'pikachu.png',
    icon: '⚡',
    name: 'Pikachu',
    role: 'Sát thương điện',
    cost: 3,
  },
  {
    id: 'trieuvan',
    img: 'tv.png',
    icon: '🐉',
    name: 'Triệu Vân',
    role: 'Đâm lướt',
    cost: 3,
  },
  {
    id: 'lubu',
    img: 'lb.png',
    icon: '⚔️',
    name: 'Lữ Bố',
    role: 'Sát thủ',
    cost: 4,
  },
  {
    id: 'ichigo',
    img: 'ichi.png',
    icon: '🗡️',
    name: 'Ichigo',
    role: 'Bankai',
    cost: 4,
  },
  {
    id: 'thachsanh',
    img: 'ts.png',
    icon: '🏹',
    name: 'Thạch Sanh',
    role: 'Xạ thủ',
    cost: 2,
  },
  {
    id: 'quancong',
    img: 'qc.png',
    icon: '🛡️',
    name: 'Quan Công',
    role: 'Đấu sĩ',
    cost: 2,
  },
  {
    id: 'phuonghoang',
    img: 'phl.png',
    icon: '🔥',
    name: 'Phượng Hoàng',
    role: 'Sát thương diện rộng',
    cost: 2,
  }
];

const skillDescriptions = {
    kyuubi: {
        q: {
            title: "Cửu Vĩ Lướt",
            cd: "5s",
            desc: "Lướt tới trước làm choáng kẻ địch. Tăng tốc đánh."
        },
        e: {
            title: "Linh Ảnh Cáo",
            cd: "8s",
            desc: "Cường hóa 4 đòn đánh tiếp theo."
        },
        r: {
            title: "Shuriken Nổ",
            cd: "8s",
            desc: "Phóng phi tiêu khổng lồ phát nổ."
        },
        space: {
            title: "RASENGAN",
            cd: "15s",
            desc: "Ném cầu năng lượng hút mục tiêu."
        }
    },
    pikachu: {
        q: {
            title: "Điện Xung",
            cd: "5s",
            desc: "Tăng 50% tốc độ chạy. Giật điện."
        },
        e: {
            title: "Bóng Pika",
            cd: "3s",
            desc: "Bắn quả bóng điện nảy bật."
        },
        r: {
            title: "Điện 10 vạn volt",
            cd: "7s",
            desc: "Tạo bão sét xung quanh bản thân."
        },
        space: {
            title: "PIKA PIKA",
            cd: "20s",
            desc: "Gọi Pet sấm sét khổng lồ."
        }
    },
    trieuvan: {
        q: {
            title: "Tấn công tức thời",
            cd: "3s",
            desc: "Đâm giáo hồi máu."
        },
        e: {
            title: "Đột kích thần tốc",
            cd: "3s",
            desc: "Lướt tới đẩy, gom địch."
        },
        r: {
            title: "Long càn",
            cd: "7s",
            desc: "Vung giáo quét vòng cung lớn hất tung."
        },
        space: {
            title: "LONG KÍCH",
            cd: "10s",
            desc: "Phóng rồng bay siêu tốc."
        }
    },
    lubu: {
        q: {
            title: "Phương Thiên Họa Kích",
            cd: "3s",
            desc: "Phóng phương thiên họa kích."
        },
        e: {
            title: "Chém Ngang",
            cd: "3s",
            desc: "Vung họa kích chém 180 độ hất tung."
        },
        r: {
            title: "Cường Hóa",
            cd: "15s",
            desc: "Hóa Chiến Thần: Nhân đôi sát thương."
        },
        space: {
            title: "CHIẾN THẦN",
            cd: "5s",
            desc: "Bay tới điểm chỉ định hất tung."
        }
    },
    ichigo: {
        q: {
            title: "Nguyệt Nha Thiên Xung",
            cd: "4s",
            desc: "Chém ra sóng năng lượng xuyên tường."
        },
        e: {
            title: "Thuấn Bộ",
            cd: "1s",
            desc: "Lướt tới hất tung, tăng tốc chạy."
        },
        r: {
            title: "Bankai (Hollow)",
            cd: "15s",
            desc: "Đeo mặt nạ Hollow: 100% chí mạng."
        },
        space: {
            title: "TRẢM SÁT",
            cd: "5s",
            desc: "Khóa mục tiêu bị hất tung, chém liên hoàn."
        }
    },
    thachsanh: {
        q: {
            title: "Lướt Sóng",
            cd: "5s",
            desc: "Lướt và LẬP TỨC làm mới E."
        },
        e: {
            title: "Ngũ Tiễn",
            cd: "6s",
            desc: "Bắn ra 5 mũi tên theo hình quạt."
        },
        r: {
            title: "Mưa Tên",
            cd: "12s",
            desc: "Trút mưa tên câm lặng."
        },
        space: {
            title: "Xuyên Tâm Tiễn",
            cd: "20s",
            desc: "Bắn đạn khổng lồ xuyên tường."
        }
    },
    quancong: {
        q: {
            title: "Thanh Long Hồn",
            cd: "5s",
            desc: "Hóa giải khống chế, chém xoay vòng."
        },
        e: {
            title: "Thanh Long Quyết",
            cd: "7s",
            desc: "GD1: Lướt tới làm choáng. Tái kích hoạt GD2: Áp sát chém 3 hit."
        },
        r: {
            title: "Thanh Long Khí",
            cd: "7s",
            desc: "Chém ra sóng kiếm khí gây câm lặng."
        },
        space: {
            title: "Thanh Long Trảm",
            cd: "20s",
            desc: "Giáng đại đao từ trên trời xuống."
        }
    },
    phuonghoang: {
        q: {
            title: "Hỏa Vực",
            cd: "8s",
            desc: "Tạo vòng lửa thiêu đốt và hút máu kẻ địch xung quanh."
        },
        e: {
            title: "Hỏa Tốc",
            cd: "3s",
            desc: "Lướt đi để lại vệt lửa. Kẻ địch dính chiêu cho phép tái kích hoạt lướt."
        },
        r: {
            title: "Phượng Vũ",
            cd: "5s",
            desc: "Tạo vụ nổ lửa cực mạnh gây câm lặng diện rộng."
        },
        space: {
            title: "Niết Bàn",
            cd: "15s",
            desc: "Hóa trứng lơ lửng, thiêu đốt địch và hồi sinh đầy máu."
        }
    }
};

export { tanks, skillDescriptions };
export default tanks;