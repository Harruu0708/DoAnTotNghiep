import fiction from "../assets/categories/fiction.png";
import children from "../assets/categories/children.png";
import health from "../assets/categories/health.png";
import business from "../assets/categories/business.png";
import academic from "../assets/categories/academic.png";
import religious from "../assets/categories/religious.png";


import book_1 from './book_1.png'
import book_2 from './book_2.png'
import book_3 from './book_3.png'
import book_4 from './book_4.png'
import book_5 from './book_5.png'
import book_6 from './book_6.png'
import book_7 from './book_7.png'
import book_8 from './book_8.png'
import book_9 from './book_9.png'
import book_10 from './book_10.png'
import book_11 from './book_11.png'
import book_12 from './book_12.png'
import book_13 from './book_13.png'
import book_14 from './book_14.png'
import book_15 from './book_15.png'
import book_16 from './book_16.png'
import book_17 from './book_17.png'
import book_18 from './book_18.png'
import book_19 from './book_19.png'
import book_20 from './book_20.png'
import book_21 from './book_21.png'
import book_22 from './book_22.png'
import book_23 from './book_23.png'
import book_24 from './book_24.png'
import book_25 from './book_25.png'
import book_26 from './book_26.png'
import book_27 from './book_27.png'
import book_28 from './book_28.png'
import book_29 from './book_29.png'
import book_30 from './book_30.png'
import book_31 from './book_31.png'
import book_32 from './book_32.png'
import book_33 from './book_33.png'
import book_34 from './book_34.png'
import book_35 from './book_35.png'
import book_36 from './book_36.png'

export const categories = [
    {
        name: "Tiểu thuyết",
        image: fiction,
    },
    {
        name: "Thiếu nhi",
        image: children,
    },
    {
        name: "Sức khỏe",
        image: health,
    },
    {
        name: "Học thuật",
        image: academic,
    },
    {
        name: "Kinh doanh",
        image: business,
    },
    {
        name: "Tôn giáo",
        image: religious,
    },
];



// icons
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaYoutube,
  } from "react-icons/fa6";


export const books = [
    // Tiểu thuyết
    {
        _id: "1",
        name: "Cuộc Trốn Thoát Vĩ Đại",
        image: book_1,
        price: 15,
        description: "Hãy đắm mình vào một câu chuyện phiêu lưu đầy gay cấn và dũng cảm.",
        category: "Tiểu thuyết",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "2",
        name: "Bóng Tối Quá Khứ",
        image: book_2,
        price: 20,
        description: "Khám phá những bí mật ẩn giấu sâu trong khu rừng bí ẩn.",
        category: "Tiểu thuyết",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "3",
        name: "Tình Yêu Vĩnh Cửu",
        image: book_3,
        price: 10,
        description: "Một câu chuyện tình cảm đầy xúc động vượt qua không gian và thời gian.",
        category: "Tiểu thuyết",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "4",
        name: "Hành Trình Của Nhà Du Hành Thời Gian",
        image: book_4,
        price: 25,
        description: "Bắt đầu một hành trình xuyên thời gian để cứu nhân loại.",
        category: "Tiểu thuyết",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "5",
        name: "Những Câu Chuyện Huyền Bí",
        image: book_5,
        price: 15,
        description: "Tuyển tập những câu chuyện đầy mê hoặc và kỳ diệu.",
        category: "Tiểu thuyết",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "6",
        name: "Vào Miền Bí Ẩn",
        image: book_6,
        price: 18,
        description: "Một câu chuyện sinh tồn kịch tính tại những vùng đất chưa ai biết đến.",
        category: "Tiểu thuyết",
        date: 1716634345448,
        popular: true,
    },

    // Thiếu nhi
    {
        _id: "7",
        name: "Những Cuộc Phiêu Lưu Ở Xứ Đồ Chơi",
        image: book_7,
        price: 12,
        description: "Cùng theo chân nhóm đồ chơi trong những chuyến phiêu lưu kỳ diệu.",
        category: "Thiếu nhi",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "8",
        name: "Những Con Vật Biết Nói",
        image: book_8,
        price: 14,
        description: "Một câu chuyện dễ thương về những con vật chia sẻ trí tuệ của mình.",
        category: "Thiếu nhi",
        date: 1716634345448,
        popular: true,
    },

    // Khoa học
    {
        _id: "9",
        name: "Vũ Trụ Và Những Điều Bí Ẩn",
        image: book_9,
        price: 22,
        description: "Khám phá những bí mật ẩn giấu trong vũ trụ bao la.",
        category: "Khoa học",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "10",
        name: "Khoa Học Đời Sống",
        image: book_10,
        price: 18,
        description: "Tìm hiểu cách khoa học ảnh hưởng đến cuộc sống hàng ngày của chúng ta.",
        category: "Khoa học",
        date: 1716634345448,
        popular: false,
    },

    // Kinh tế
    {
        _id: "11",
        name: "Bí Quyết Thành Công Tài Chính",
        image: book_11,
        price: 30,
        description: "Học cách quản lý tiền bạc và đầu tư thông minh.",
        category: "Kinh tế",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "12",
        name: "Kinh Doanh Hiện Đại",
        image: book_12,
        price: 25,
        description: "Những nguyên tắc quan trọng để thành công trong kinh doanh hiện đại.",
        category: "Kinh tế",
        date: 1716634345448,
        popular: false,
    },

    // Lịch sử
    {
        _id: "13",
        name: "Những Sự Kiện Thay Đổi Thế Giới",
        image: book_13,
        price: 28,
        description: "Khám phá những khoảnh khắc lịch sử quan trọng đã thay đổi thế giới.",
        category: "Lịch sử",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "14",
        name: "Những Nhà Lãnh Đạo Vĩ Đại",
        image: book_14,
        price: 20,
        description: "Tìm hiểu về những nhân vật lãnh đạo xuất sắc trong lịch sử.",
        category: "Lịch sử",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "15",
        name: "Dinh Dưỡng Đơn Giản",
        image: book_15,
        price: 15,
        description: "Hiểu rõ những kiến thức cơ bản về ăn uống cân bằng và sức khỏe.",
        category: "Sức khỏe",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "16",
        name: "Sức Mạnh Của Giấc Ngủ",
        image: book_16,
        price: 22,
        description: "Khám phá tầm quan trọng của giấc ngủ đối với một cuộc sống khỏe mạnh.",
        category: "Sức khỏe",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "17",
        name: "Thân Hình Cân Đối Trong 30 Ngày",
        image: book_17,
        price: 25,
        description: "Hướng dẫn tập luyện nhanh giúp bạn có thân hình cân đối.",
        category: "Sức khỏe",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "18",
        name: "Chữa Lành Cùng Thiên Nhiên",
        image: book_18,
        price: 18,
        description: "Tìm hiểu cách thiên nhiên góp phần cải thiện sức khỏe tinh thần.",
        category: "Sức khỏe",
        date: 1716634345448,
        popular: false,
    },

    // Học thuật
    {
        _id: "19",
        name: "Nhập Môn Vật Lý",
        image: book_19,
        price: 30,
        description: "Hướng dẫn chuyên sâu về các khái niệm vật lý cơ bản.",
        category: "Học thuật",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "20",
        name: "Toán Học Đơn Giản",
        image: book_20,
        price: 25,
        description: "Giải thích dễ hiểu giúp đơn giản hóa các khái niệm toán học phức tạp.",
        category: "Học thuật",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "21",
        name: "Lịch Sử Thế Giới Hiện Đại",
        image: book_21,
        price: 18,
        description: "Khám phá những sự kiện quan trọng đã hình thành thời đại ngày nay.",
        category: "Học thuật",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "22",
        name: "Thí Nghiệm Hóa Học Cho Người Mới Bắt Đầu",
        image: book_22,
        price: 22,
        description: "Những thí nghiệm thực hành giúp bạn hiểu rõ về hóa học cơ bản.",
        category: "Học thuật",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "23",
        name: "Nghệ Thuật Lập Trình",
        image: book_23,
        price: 28,
        description: "Hướng dẫn từng bước về lập trình và giải quyết vấn đề.",
        category: "Học thuật",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "24",
        name: "Khám Phá Vũ Trụ",
        image: book_24,
        price: 30,
        description: "Khám phá sâu về thiên văn học và khám phá không gian.",
        category: "Học thuật",
        date: 1716634345448,
        popular: false,
    },

    // Business
    {
        _id: "25",
        name: "Khởi Nghiệp 101",
        image: book_25,
        price: 22,
        description: "Tìm hiểu những kiến thức cơ bản về khởi nghiệp và vận hành doanh nghiệp.",
        category: "Kinh doanh",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "26",
        name: "Chiến Lược Tiếp Thị",
        image: book_26,
        price: 24,
        description: "Các kỹ thuật đã được kiểm chứng để tiếp thị và xây dựng thương hiệu hiệu quả.",
        category: "Kinh doanh",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "27",
        name: "Lãnh Đạo Thành Công",
        image: book_27,
        price: 26,
        description: "Những kỹ năng và chiến lược quan trọng để trở thành một nhà lãnh đạo xuất sắc.",
        category: "Kinh doanh",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "28",
        name: "Tài Chính Cho Người Mới Bắt Đầu",
        image: book_28,
        price: 18,
        description: "Hiểu rõ các khái niệm cơ bản về tài chính cá nhân và doanh nghiệp.",
        category: "Kinh doanh",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "29",
        name: "Nghệ Thuật Đàm Phán",
        image: book_29,
        price: 22,
        description: "Học cách đàm phán hiệu quả trong mọi tình huống.",
        category: "Kinh doanh",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "30",
        name: "Làm Chủ Quản Lý Thời Gian",
        image: book_30,
        price: 20,
        description: "Mẹo thực tế để quản lý thời gian và nâng cao năng suất.",
        category: "Kinh doanh",
        date: 1716634345448,
        popular: true,
    },

    // Tôn giáo
    {
        _id: "31",
        name: "Con Đường Giác Ngộ",
        image: book_31,
        price: 15,
        description: "Khám phá những lời dạy hướng dẫn con người đến sự bình an tâm linh.",
        category: "Tôn giáo",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "32",
        name: "Những Câu Chuyện Từ Kinh Sách",
        image: book_32,
        price: 18,
        description: "Một tập hợp những câu chuyện truyền cảm hứng từ kinh sách.",
        category: "Tôn giáo",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "33",
        name: "Sức Mạnh Của Lời Cầu Nguyện",
        image: book_33,
        price: 12,
        description: "Khám phá tác động chuyển hóa của những lời cầu nguyện chân thành.",
        category: "Tôn giáo",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "34",
        name: "Cuộc Đời Con Người",
        image: book_34,
        price: 20,
        description: "Một tiểu sử sâu sắc về những giá trị của cuộc sống.",
        category: "Tôn giáo",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "35",
        name: "Hiểu Biết Về Tôn Giáo",
        image: book_35,
        price: 22,
        description: "Tìm hiểu ý nghĩa của những lời dạy tốt đẹp nhất từ tôn giáo.",
        category: "Tôn giáo",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "36",
        name: "Trí Tuệ Tâm Linh",
        image: book_36,
        price: 25,
        description: "Những bài học vượt thời gian giúp phát triển bản thân và tinh thần.",
        category: "Tôn giáo",
        date: 1716634345448,
        popular: true,
    },

];



// FOOTER SECTION
export const FOOTER_LINKS = [
    {
      title: "Learn More",
      links: [
        "About Us",
        "Latest books",
        "Hot Offers",
        "Popular books",
        "FAQ",
        "Privacy Policy",
      ],
    },
    {
      title: "Our Community",
      links: [
        "Terms and Conditions",
        "Special Offers",
        "Customer Reviews",
      ],
    },
  ];
  
  export const FOOTER_CONTACT_INFO = {
    title: "Contact Us",
    links: [
      { label: "Contact Number", value: "123-456-7890" },
      { label: "Email Address", value: "info@haru.com" },
    ],
  };
  
  export const SOCIALS = {
    title: "Social",
    links: [
      { icon: <FaFacebook />, id: "facebook" },
      { icon: <FaInstagram />, id: "instagram" },
      { icon: <FaTwitter />, id: "twitter" },
      { icon: <FaYoutube />, id: "youtube" },
      { icon: <FaLinkedin />, id: "linkedin" },
    ],
  };
