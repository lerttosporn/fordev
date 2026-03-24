
// seed.ts
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.VITE_SUPABASE_URL; // เปลี่ยนชื่อตัวแปรให้ตรงกับใน .env ของคุณ
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // ใช้ Service Role Key เพื่อให้มีสิทธิ์เขียนข้อมูลทะลุ RLS ได้

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. เตรียมข้อมูลเริ่มต้น (Mock Data)
const initialRooms = [
  {
    name: "Standard Room",
    type: "standard",
    capacity: 2,
    price_general: 1800,
    price_personnel: 1500,
    max_extra_beds: 1,
    extra_bed_price: 500
  },
  {
    name: "Deluxe Room",
    type: "deluxe",
    capacity: 2,
    price_general: 2500,
    price_personnel: 2000,
    max_extra_beds: 2,
    extra_bed_price: 700
  }
];

// 3. ฟังก์ชันสำหรับยิงข้อมูลเข้า Database
async function runSeed() {
  console.log("🌱 เริ่มต้นการ Seed ข้อมูล...");

  try {
    // ลบข้อมูลเก่าทิ้งก่อน (ถ้าต้องการให้เริ่มใหม่หมด)
    // await supabase.from('rooms').delete().neq('id', '0'); 

    // ยิงข้อมูลใหม่เข้าไป
    const { data, error } = await supabase
      .from('rooms') // ชื่อตารางใน Supabase ของคุณ
      .insert(initialRooms);

    if (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error.message);
      return;
    }

    console.log("✅ Seed ข้อมูลห้องพักสำเร็จเรียบร้อย!");
    
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
  }
}

// สั่งรันฟังก์ชัน
runSeed();