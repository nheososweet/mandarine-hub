"use client"

import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "./react-pdf-highlighter";
import type {
  Content,
  IHighlight,
  NewHighlight,
  ScaledPosition,
} from "./react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import { testHighlights as _testHighlights } from "./test-highlights";

import "./style/App.css";
import "../../../plugins/react-pdf-highlighter/dist/style.css";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "/noiquy.pdf";
const SECONDARY_PDF_URL = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";


export default function Page() {
  const searchParams = new URLSearchParams(document.location.search);
  const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

  const [url, setUrl] = useState(initialUrl);
  const [highlights, setHighlights] = useState<Array<IHighlight>>(
    [
      {
        "content": {
          "text": "- \nNhân sự làm việc tại nhà theo chính sách của khách hàng \nĐiều 6 : Trang thiết bị làm việc \n- \nNhân viên chính thức được cấp máy tính làm việc tại văn phòng \n- \nNhân viên thử việc: dùng máy tính cá nhân trong thời gian thử việc \n- \nThực tập sinh: Dùng máy cá nhân \n- \nOnsite tại khách hàng: Dùng máy tính Khách hàng hoặc máy tính cá nhân, Trường hợp nhân \nsự không có máy sẽ đề xuất lên ban giám đốc để được xét duyệt. \n \n \n                                                                        TỔNG GIÁM ĐỐC"
        },
        "position": {
          "boundingRect": {
            "x1": 63,
            "y1": 410.6826477050781,
            "x2": 381.9100036621094,
            "y2": 425.02935791015625,
            "width": 612,
            "height": 792,
            "pageNumber": 4
          },
          "rects": [
            {
              "x1": 63,
              "y1": 410.6826477050781,
              "x2": 381.9100036621094,
              "y2": 425.02935791015625,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            },
            {
              "x1": 63,
              "y1": 433.1226501464844,
              "x2": 239.2100067138672,
              "y2": 447.4693603515625,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            },
            {
              "x1": 63,
              "y1": 455.5626220703125,
              "x2": 417.9100036621094,
              "y2": 469.9093322753906,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            },
            {
              "x1": 63,
              "y1": 478.00262451171875,
              "x2": 434.1099853515625,
              "y2": 492.3493347167969,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            },
            {
              "x1": 63,
              "y1": 500.442626953125,
              "x2": 260.3299865722656,
              "y2": 514.7893676757812,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            }
          ],
          "pageNumber": 4
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "4_0_3144050761",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 4
      },
      {
        "content": {
          "text": "Công ty Cổ phần Sphinx \nTầng 1, Tòa nhà HL, Số 6/82 Đường Duy Tân, Phường Dịch Vọng \nHậu, Quận Cầu Giấy, Hà Nội \n \n \n--------------------------------------------------------- \n \n \n \nNỘI QUY VÀ CHẾ ĐỘ LÀM VIỆC \nCông ty đề cao tinh thần chính trực và tự giác của các nhân viên bao gồm cả nhân viên chính thức và \nnhân viên thực tập (“NV”) trong việc thực hiện và tuân thủ Nội quy này.  \nĐiều 1: Thời giờ làm việc \n1.1.     Giờ làm việc tiêu chuẩn  \n \n- \nTừ Thứ Hai đến Thứ Sáu \nBuổi sáng: Từ 9:00   đến 12:00 \nBuổi chiều: Từ 13:30 đến 18:00 \n1.2.    Tuân thủ thời gian làm việc đúng giờ \n- \nNhân sự đi muộn phải có lí do chính đáng, và được trưởng bộ phận phê duyệt \n- \nNhân sự được phép đi muộn 3 lần / tháng ( thời gian không quá 30p) \nĐiều 2: Thủ tục xin nghỉ \n2.1.    Đối với trường hợp khẩn cấp, có việc đột xuất, cần nghỉ từ một ngày làm việc trở xuống, NV \nphải nhắn tin, nhận được sự đồng ý của người quản lý trực tiếp sau đó thông báo đến bộ phận \nAdmin"
        },
        "position": {
          "boundingRect": {
            "x1": 177.25999450683594,
            "y1": 18.692630767822266,
            "x2": 545.8598022460938,
            "y2": 122.69938659667969,
            "width": 612,
            "height": 792,
            "pageNumber": 1
          },
          "rects": [
            {
              "x1": 177.25999450683594,
              "y1": 18.692630767822266,
              "x2": 545.8598022460938,
              "y2": 122.69938659667969,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            },
            {
              "x1": 45,
              "y1": 706.0559692382812,
              "x2": 239.42503356933594,
              "y2": 755.8560180664062,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            },
            {
              "x1": 186.02000427246094,
              "y1": 163.99960327148438,
              "x2": 438.94000244140625,
              "y2": 181.66732788085938,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            }
          ],
          "pageNumber": 1
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "1_1_548152686",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 1
      },
      {
        "content": {
          "text": "Công ty Cổ phần Sphinx \nTầng 1, Tòa nhà HL, Số 6/82 Đường Duy Tân, Phường Dịch Vọng \nHậu, Quận Cầu Giấy, Hà Nội \n \n \n--------------------------------------------------------- \n \n \n \n- \nQuà tết \n- \nThưởng lương tháng 13 theo kết quả hoạt động kinh doanh của công ty \n- \nThưởng dự án theo kết quả hoạt động kinh doanh của công ty \n- \nThưởng giới thiệu nhân sự mới \n- \nHằng năm có 2 đợt đánh giá nhân sự: tháng 3 và tháng 9 khi nhân sự làm đủ 6 tháng chính \nthức tại công ty. Tăng lương 1 lần/ năm theo hệ số đánh giá KPI \nĐiều 5: Làm việc tại nhà ( WFH) \n+ Đối với nhân sự tại văn phòng \n- \nDo dịch covid: Trường hợp bị phong tỏa chỗ ở, F1 và theo giãn cách của thủ tướng chính phủ \n- \nNhân sự làm việc tại nhà phải được sự đồng ý của ban giám đốc và  tối đa 3 buổi/ tháng \n+ Đối với nhân sự làm việc tại khách hàng \n- \nNhân sự làm việc tại nhà theo chính sách của khách hàng \nĐiều 6 : Trang thiết bị làm việc \n- \nNhân viên chính thức được cấp máy tính làm việc tại văn phòng \n-"
        },
        "position": {
          "boundingRect": {
            "x1": 177.25999450683594,
            "y1": 18.692630767822266,
            "x2": 545.8598022460938,
            "y2": 122.69938659667969,
            "width": 612,
            "height": 792,
            "pageNumber": 4
          },
          "rects": [
            {
              "x1": 177.25999450683594,
              "y1": 18.692630767822266,
              "x2": 545.8598022460938,
              "y2": 122.69938659667969,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            },
            {
              "x1": 45,
              "y1": 706.0559692382812,
              "x2": 239.42503356933594,
              "y2": 755.8560180664062,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            },
            {
              "x1": 63,
              "y1": 164.03265380859375,
              "x2": 122.18000030517578,
              "y2": 178.37937927246094,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            },
            {
              "x1": 63,
              "y1": 186.47265625,
              "x2": 454.0299987792969,
              "y2": 200.8193817138672,
              "width": 612,
              "height": 792,
              "pageNumber": 4
            }
          ],
          "pageNumber": 4
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "4_2_4170311839",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 4
      },
      {
        "content": {
          "text": "- \nNghỉ phép không thông báo với người quản lý trực tiếp và Admin sẽ không được hưởng lương \n- \nNghỉ thai sản: 06 tháng \n- \nNghỉ bản thân kết hôn: 3 ngày \n- \nCon lập gia đình: 1 ngày  \n- \nBố mẹ ( cả bên chồng và bên vợ) mất, hoặc vợ , chồng, con mất: 3 ngày \n- \nĐược nghỉ không lương nhưng không quá 14 ngày/ năm \n- \nCác ngày nghỉ lễ, tết theo quy định của nhà nước \n- \nBản thân ốm nằm viện : 3 ngày \n- \nThời gian thử việc không tính phép được hoàn lại 2 ngày phép của 2 tháng thử việc sau khi kí  \nhợp đồng lao động chính thức \n2. Chế độ khác \n- \nDu lịch hàng năm cùng công ty \n- \nQuà sinh nhật, các dịp lễ \n- \nTham gia BHYT, BHXH, BHTN…."
        },
        "position": {
          "boundingRect": {
            "x1": 63,
            "y1": 388.3426513671875,
            "x2": 576.8200073242188,
            "y2": 402.6893615722656,
            "width": 612,
            "height": 792,
            "pageNumber": 2
          },
          "rects": [
            {
              "x1": 63,
              "y1": 388.3426513671875,
              "x2": 576.8200073242188,
              "y2": 402.6893615722656,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            },
            {
              "x1": 63,
              "y1": 410.6826477050781,
              "x2": 205.61000061035156,
              "y2": 425.02935791015625,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            },
            {
              "x1": 63,
              "y1": 433.1226501464844,
              "x2": 241.73001098632812,
              "y2": 447.4693603515625,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            },
            {
              "x1": 63,
              "y1": 455.5626220703125,
              "x2": 215.69000244140625,
              "y2": 469.9093322753906,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            },
            {
              "x1": 63,
              "y1": 478.00262451171875,
              "x2": 458.3800048828125,
              "y2": 492.3493347167969,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            }
          ],
          "pageNumber": 2
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "2_3_660629327",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 2
      },
      {
        "content": {
          "text": "Công ty Cổ phần Sphinx \nTầng 1, Tòa nhà HL, Số 6/82 Đường Duy Tân, Phường Dịch Vọng \nHậu, Quận Cầu Giấy, Hà Nội \n \n \n--------------------------------------------------------- \n \n \n \n \nĐiều 3: Vệ sinh nơi làm việc  \n \n-         Người lao động phải có trách nhiệm giữ gìn tài sản chung \n-         Trước khi rời khỏi chỗ làm , người lao động vệ sinh nơi làm việc , kiểm tra thiết bị điện, nước \ntại chỗ. Đảm bảo các thiết bị đã được tắt. \nĐiều 4: Chế độ \n1. Thời gian nghỉ phép \n- \nNgày phép: 12 ngày / năm với nhân sự làm việc dưới 1 năm, các năm tiếp theo tăng thêm 1 \nngày và không quá 14 ngày / năm. Trường hợp ngày nghỉ phép năm vẫn còn, sẽ được chuyển \nsang năm tiếp theo. Tuy nhiên, người lao động phải nghỉ hết phép trước ngày 31/3 năm sau \n- \nNghỉ phép không thông báo với người quản lý trực tiếp và Admin sẽ không được hưởng lương \n- \nNghỉ thai sản: 06 tháng \n- \nNghỉ bản thân kết hôn: 3 ngày \n- \nCon lập gia đình: 1 ngày  \n-"
        },
        "position": {
          "boundingRect": {
            "x1": 177.25999450683594,
            "y1": 18.692630767822266,
            "x2": 545.8598022460938,
            "y2": 122.69938659667969,
            "width": 612,
            "height": 792,
            "pageNumber": 2
          },
          "rects": [
            {
              "x1": 177.25999450683594,
              "y1": 18.692630767822266,
              "x2": 545.8598022460938,
              "y2": 122.69938659667969,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            },
            {
              "x1": 45,
              "y1": 706.0559692382812,
              "x2": 239.42503356933594,
              "y2": 755.8560180664062,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            },
            {
              "x1": 45,
              "y1": 186.47265625,
              "x2": 250.25,
              "y2": 200.8193817138672,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            },
            {
              "x1": 45,
              "y1": 208.91265869140625,
              "x2": 384.42999267578125,
              "y2": 223.25938415527344,
              "width": 612,
              "height": 792,
              "pageNumber": 2
            }
          ],
          "pageNumber": 2
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "2_4_269718075",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 2
      },
      {
        "content": {
          "text": "Công ty Cổ phần Sphinx \nTầng 1, Tòa nhà HL, Số 6/82 Đường Duy Tân, Phường Dịch Vọng \nHậu, Quận Cầu Giấy, Hà Nội \n \n \n--------------------------------------------------------- \n \n \n \n- \n Các mức đóng BHXH: \n+ Nhân viên : 5.000.000 đồng \n+ Leader : 7.000.000 đồng \n+ Quản lý : 10.000.000 đồng \n- \nĐược cấp phát đồng phục công ty \n- \nTham gia hoạt động Teambuilding  \n3. Thời gian làm thêm giờ \n- \nĐối với các ngày từ thứ 2 đến thứ 6 hàng tuần: người lao động sẽ được thanh toán 150% tiền \nlương thực trả của NLĐ \n- \nĐối với ngày nghỉ là Thứ 7 và chủ nhật: Người lao đông sẽ được thanh toán 200% tiền lương \nthực trả của NLĐ \n- \nĐối với các ngày lễ , tết: Người lao động được thanh toán 300% tiền lương thực trả của NLĐ \n- \nNhân sự onsite: Theo quy định của khách hàng \n- \nTrợ cấp onsite: 150.000 VNĐ/ ngày – Áp dụng làm việc tại địa chỉ khách hàng \nRemote áp dụng cho dự án làm full 2 ngày T7/ tháng \nTrợ cấp không tính vào lương để tính OT \nRemote nửa ngày t7 không được tính trợ cấp 150.000"
        },
        "position": {
          "boundingRect": {
            "x1": 177.25999450683594,
            "y1": 18.692630767822266,
            "x2": 545.8598022460938,
            "y2": 122.69938659667969,
            "width": 612,
            "height": 792,
            "pageNumber": 3
          },
          "rects": [
            {
              "x1": 177.25999450683594,
              "y1": 18.692630767822266,
              "x2": 545.8598022460938,
              "y2": 122.69938659667969,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 45,
              "y1": 706.0559692382812,
              "x2": 239.42503356933594,
              "y2": 755.8560180664062,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 63,
              "y1": 164.03265380859375,
              "x2": 206.9300079345703,
              "y2": 178.37937927246094,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 81.02400207519531,
              "y1": 186.47265625,
              "x2": 240.0500030517578,
              "y2": 200.8193817138672,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 81.02400207519531,
              "y1": 208.91265869140625,
              "x2": 222.41000366210938,
              "y2": 223.25938415527344,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 81.02400207519531,
              "y1": 231.3526611328125,
              "x2": 234.29000854492188,
              "y2": 245.6993865966797,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            }
          ],
          "pageNumber": 3
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "3_5_1837998275",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 3
      },
      {
        "content": {
          "text": "2.1.    Đối với trường hợp khẩn cấp, có việc đột xuất, cần nghỉ từ một ngày làm việc trở xuống, NV \nphải nhắn tin, nhận được sự đồng ý của người quản lý trực tiếp sau đó thông báo đến bộ phận \nAdmin \n2.2.    Đối với trường hợp nghỉ trên một ngày làm việc, NV phải gửi email báo trước ít nhất 01 (một) \nngày làm việc và nhận được sự đồng ý của người quản lý trực tiếp.  \n2.3  \nTrường hợp muốn xin nghỉ việc, NV phải gửi email báo trước ít nhất 30 (ba mươi) ngày cho \nngười quản lý trực tiếp, đồng thời chủ động hoàn thành và bàn giao các công việc mà mình \nđang phụ trách cho NV khác được chỉ định bởi người quản lý trực tiếp. Trường hợp NV vi \nphạm quy định này và gây ảnh hưởng đến hoạt động của Công ty, NV phải bồi thường cho \nCông ty số tiền tương đương với tiền lương của số ngày nghỉ sớm."
        },
        "position": {
          "boundingRect": {
            "x1": 45,
            "y1": 468.2826232910156,
            "x2": 579.3399658203125,
            "y2": 482.62933349609375,
            "width": 612,
            "height": 792,
            "pageNumber": 1
          },
          "rects": [
            {
              "x1": 45,
              "y1": 468.2826232910156,
              "x2": 579.3399658203125,
              "y2": 482.62933349609375,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            },
            {
              "x1": 81.02400207519531,
              "y1": 490.7226257324219,
              "x2": 579.3399658203125,
              "y2": 505.0693359375,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            },
            {
              "x1": 81.02400207519531,
              "y1": 513.16259765625,
              "x2": 120.37999725341797,
              "y2": 527.5093383789062,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            },
            {
              "x1": 45,
              "y1": 535.6026611328125,
              "x2": 579.3400268554688,
              "y2": 549.9494018554688,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            },
            {
              "x1": 81.02400207519531,
              "y1": 558.0426025390625,
              "x2": 435.30999755859375,
              "y2": 572.3893432617188,
              "width": 612,
              "height": 792,
              "pageNumber": 1
            }
          ],
          "pageNumber": 1
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "1_6_1995148046",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 1
      },
      {
        "content": {
          "text": "Remote áp dụng cho dự án làm full 2 ngày T7/ tháng \nTrợ cấp không tính vào lương để tính OT \nRemote nửa ngày t7 không được tính trợ cấp 150.000 \n- \nĐối với lịch làm lịch \n- \nNhân sự onsite làm 2 ngày thứ 7, thứ 7 tính 100% lương \n- \nNhân sự onsite làm 3 ngày thứ 7: 2 ngày thứ 7 tính 100% lương, 1 ngày thứ 7 tính 200% lương \n- \nNhân sự onsite làm 4 ngày thứ 7 : 2 ngày thứ 7 tính 100% lương, 2 ngày thứ 7 tính 200% \nlương \n4. Các mức thưởng \n- \nThưởng các dịp lễ, tết"
        },
        "position": {
          "boundingRect": {
            "x1": 81.02400207519531,
            "y1": 478.00262451171875,
            "x2": 359.7099914550781,
            "y2": 492.3493347167969,
            "width": 612,
            "height": 792,
            "pageNumber": 3
          },
          "rects": [
            {
              "x1": 81.02400207519531,
              "y1": 478.00262451171875,
              "x2": 359.7099914550781,
              "y2": 492.3493347167969,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 81.02400207519531,
              "y1": 500.442626953125,
              "x2": 299.3299865722656,
              "y2": 514.7893676757812,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 81.02400207519531,
              "y1": 522.8826293945312,
              "x2": 362.8299865722656,
              "y2": 537.2293701171875,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 63,
              "y1": 545.3226318359375,
              "x2": 192.260009765625,
              "y2": 559.6693725585938,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 63,
              "y1": 567.6426391601562,
              "x2": 377.5899963378906,
              "y2": 581.9893798828125,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            },
            {
              "x1": 81.02400207519531,
              "y1": 634.9926147460938,
              "x2": 114.73999786376953,
              "y2": 649.33935546875,
              "width": 612,
              "height": 792,
              "pageNumber": 3
            }
          ],
          "pageNumber": 3
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "id": "3_7_3119626752",
        "source": "Sphinx Noi Quy Cong Ty.pdf",
        "page": 3
      }
    ]
  );

  console.log("App renders", { url, highlights });

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
    setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : []);
  };

  const scrollViewerTo = useRef((highlight: IHighlight) => { });

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false,
      );
    };
  }, [scrollToHighlightFromHash]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    console.log("Saving highlight", highlight);
    setHighlights((prevHighlights) => [
      { ...highlight, id: getNextId() },
      ...prevHighlights,
    ]);
  };

  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
  ) => {
    console.log("Updating highlight", highlightId, position, content);
    setHighlights((prevHighlights) =>
      prevHighlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest,
          }
          : h;
      }),
    );
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
      />
      <div
        style={{
          height: "100vh",
          width: "75vw",
          position: "relative",
        }}
      >
        <PdfLoader url={url} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              scrollRef={(scrollTo) => {
                scrollViewerTo.current = scrollTo;
                scrollToHighlightFromHash();
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection,
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment });
                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo,
              ) => {
                const isTextHighlight = !highlight.content?.image;

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) },
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, (highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                  >
                    {component}
                  </Popup>
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
    </div>
  );
}
