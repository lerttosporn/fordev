// // // --- Mock Data ---
// // export const ROOMS: Room[] = [
// //   {
// //     id: "superior",
// //     name: "Superior Room",
// //     description:
// //       "Compact yet comfortable, perfect for short stays and business travelers.",
// //     price: 1200,
// //     size: "28 sq.m.",
// //     image:
// //       "https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&q=80&w=1080",
// //     imageInSide: [
// //       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcGFjaW91cyUyMGhvdGVsJTIwc3VpdGUlMjByb29tJTIwd2l0aCUyMGJhbGNvbnklMjBhbmQlMjBsaXZpbmclMjBhcmVhfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1595161695996-f746349f4945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJlZHJvb20lMjB3aXRoJTIwa2luZyUyMGJlZCUyMGFuZCUyMHdvb2QlMjBhY2NlbnRzfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1516650556972-e9904734f467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuZXR0ZSUyMHdpdGglMjBkaW5pbmclMjB0YWJsZSUyMHdvb2R8ZW58MXx8fHwxNzcwNzkzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHdpdGglMjBiYXRodHViJTIwY2xlYW4lMjB3aGl0ZXxlbnwxfHx8fDE3NzA3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //     ],
// //     isHighlight: false,
// //     extraBedPrice: 2,
// //   },
// //   {
// //     id: "deluxe",
// //     name: "Deluxe Room",
// //     description:
// //       "Extra space with premium furnishings and enhanced city views.",
// //     price: 1500,
// //     size: "35 sq.m.",
// //     image:
// //       "https://images.unsplash.com/photo-1654064550497-34dfe63ef0a8?auto=format&fit=crop&q=80&w=1080",
// //     imageInSide: [
// //       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcGFjaW91cyUyMGhvdGVsJTIwc3VpdGUlMjByb29tJTIwd2l0aCUyMGJhbGNvbnklMjBhbmQlMjBsaXZpbmclMjBhcmVhfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1595161695996-f746349f4945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJlZHJvb20lMjB3aXRoJTIwa2luZyUyMGJlZCUyMGFuZCUyMHdvb2QlMjBhY2NlbnRzfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1516650556972-e9904734f467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuZXR0ZSUyMHdpdGglMjBkaW5pbmclMjB0YWJsZSUyMHdvb2R8ZW58MXx8fHwxNzcwNzkzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHdpdGglMjBiYXRodHViJTIwY2xlYW4lMjB3aGl0ZXxlbnwxfHx8fDE3NzA3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //     ],
// //     extraBedPrice: 2,
// //     isHighlight: false,
// //   },
// //   {
// //     id: "suite",
// //     name: "Suite Room",
// //     description:
// //       "Our largest luxury space with living area, kitchenette, and private balcony.",
// //     price: 1800,
// //     size: "52 sq.m.",
// //     image:
// //       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?auto=format&fit=crop&q=80&w=1080",
// //     imageInSide: [
// //       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcGFjaW91cyUyMGhvdGVsJTIwc3VpdGUlMjByb29tJTIwd2l0aCUyMGJhbGNvbnklMjBhbmQlMjBsaXZpbmclMjBhcmVhfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1595161695996-f746349f4945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJlZHJvb20lMjB3aXRoJTIwa2luZyUyMGJlZCUyMGFuZCUyMHdvb2QlMjBhY2NlbnRzfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1516650556972-e9904734f467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuZXR0ZSUyMHdpdGglMjBkaW5pbmclMjB0YWJsZSUyMHdvb2R8ZW58MXx8fHwxNzcwNzkzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //       "https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHdpdGglMjBiYXRodHViJTIwY2xlYW4lMjB3aGl0ZXxlbnwxfHx8fDE3NzA3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
// //     ],
// //     extraBedPrice: 2,
// //     isHighlight: true,
// //     tag: "Best Value",
// //   },
// // ];

// import MeetingSpaces from "../models/MeetingSpacesModel";
// import RoomModel from "../models/RoomModel";

// export const ROOMS: RoomModel[] = [
//   {
//     id: "superior",
//     name: "Superior",
//     description:
//       "ห้องพักขนาดกะทัดรัด ตกแต่งทันสมัย เหมาะสำหรับการพักผ่อนระยะสั้นหรือผู้ที่ต้องการความเงียบสงบ",
//     image:
//       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?auto=format&fit=crop&q=80&w=1080",
//     imageInSide: [
//       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcGFjaW91cyUyMGhvdGVsJTIwc3VpdGUlMjByb29tJTIwd2l0aCUyMGJhbGNvbnklMjBhbmQlMjBsaXZpbmclMjBhcmVhfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1595161695996-f746349f4945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJlZHJvb20lMjB3aXRoJTIwa2luZyUyMGJlZCUyMGFuZCUyMHdvb2QlMjBhY2NlbnRzfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1516650556972-e9904734f467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuZXR0ZSUyMHdpdGglMjBkaW5pbmclMjB0YWJsZSUyMHdvb2R8ZW58MXx8fHwxNzcwNzkzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHdpdGglMjBiYXRodHViJTIwY2xlYW4lMjB3aGl0ZXxlbnwxfHx8fDE3NzA3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//     ],

//     sizeSqM: 30,
//     baseGuests: 2,
//     maxGuests: 2, // "2 ท่าน" ตามตาราง
//     maxExtraBeds: 0, // ไม่ระบุว่าเสริมได้ในตาราง
//     extraBedPrice: 0,
//     rates: {
//       daily: {
//         personnel: 800,
//         general: 1000,
//       },
//       group: {
//         min5Rooms: 750,
//         min10Rooms: 750,
//       },
//       monthly: 15000,
//     },
//     amenities: ["Free Wi-Fi", "Air Conditioning", "Work Desk", "Shower"],
//   },
//   {
//     id: "deluxe",
//     name: "Deluxe",
//     description:
//       "ห้องพักกว้างขวางขึ้น พร้อมพื้นที่ใช้สอยที่สะดวกสบาย รองรับการเสริมเตียงได้",
//     image:
//       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?auto=format&fit=crop&q=80&w=1080",
//     imageInSide: [
//       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcGFjaW91cyUyMGhvdGVsJTIwc3VpdGUlMjByb29tJTIwd2l0aCUyMGJhbGNvbnklMjBhbmQlMjBsaXZpbmclMjBhcmVhfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1595161695996-f746349f4945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJlZHJvb20lMjB3aXRoJTIwa2luZyUyMGJlZCUyMGFuZCUyMHdvb2QlMjBhY2NlbnRzfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1516650556972-e9904734f467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuZXR0ZSUyMHdpdGglMjBkaW5pbmclMjB0YWJsZSUyMHdvb2R8ZW58MXx8fHwxNzcwNzkzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHdpdGglMjBiYXRodHViJTIwY2xlYW4lMjB3aGl0ZXxlbnwxfHx8fDE3NzA3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//     ],
//     sizeSqM: 40,
//     baseGuests: 2,
//     maxGuests: 3, // "3 ท่าน (เสริมเตียงได้ 1 เตียง)"
//     maxExtraBeds: 1,
//     extraBedPrice: 500, // "500/คืน"
//     rates: {
//       daily: {
//         personnel: 1000,
//         general: 1200,
//       },
//       group: {
//         min5Rooms: 900,
//         min10Rooms: 750,
//       },
//       monthly: 18000,
//     },
//     amenities: [
//       "Free Wi-Fi",
//       "Air Conditioning",
//       "Smart TV",
//       "Refrigerator",
//       "Sofa",
//     ],
//   },
//   {
//     id: "suite",
//     name: "Suite",
//     description:
//       "ห้องพักหรูขนาดใหญ่ที่สุด แยกสัดส่วนห้องนั่งเล่นและห้องนอน เหมาะสำหรับครอบครัว",
//     image:
//       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?auto=format&fit=crop&q=80&w=1080",
//     imageInSide: [
//       "https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcGFjaW91cyUyMGhvdGVsJTIwc3VpdGUlMjByb29tJTIwd2l0aCUyMGJhbGNvbnklMjBhbmQlMjBsaXZpbmclMjBhcmVhfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1595161695996-f746349f4945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJlZHJvb20lMjB3aXRoJTIwa2luZyUyMGJlZCUyMGFuZCUyMHdvb2QlMjBhY2NlbnRzfGVufDF8fHx8MTc3MDc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1516650556972-e9904734f467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuZXR0ZSUyMHdpdGglMjBkaW5pbmclMjB0YWJsZSUyMHdvb2R8ZW58MXx8fHwxNzcwNzkzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//       "https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHdpdGglMjBiYXRodHViJTIwY2xlYW4lMjB3aGl0ZXxlbnwxfHx8fDE3NzA3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//     ],
//     sizeSqM: 52,
//     baseGuests: 2,
//     maxGuests: 4, // "4 ท่าน (เสริมเตียงได้ 2 เตียง)"
//     maxExtraBeds: 2,
//     extraBedPrice: 500, // "500/คืน"
//     rates: {
//       daily: {
//         personnel: 1500,
//         general: 1800,
//       },
//       group: {
//         min5Rooms: 1350,
//         min10Rooms: 1350,
//       },
//       monthly: 27000,
//     },
//     amenities: [
//       "Free Wi-Fi",
//       "Separate Living Area",
//       "Kitchenette",
//       "Bathtub",
//       "Balcony",
//     ],
//   },
// ];


// export const MEETING_SPACES: MeetingSpaces[] = [
//   {
//     id: "meetingroom",
//     type: "Meeting Room",
//     hour: 1000,
//     halfDays: 3200,
//     fullDays: 6000,
//     maxGuests: 50,
//   },
//   {
//     id: "foodroom",
//     type: "Food Room",
//     hour: 800,
//     halfDays: 2400,
//     fullDays: 4500,
//     maxGuests: 50,
//   },
// ];
