// Extra catalog for the PC builder. Prices are sample PKR figures.
// "score" is a rough ranking inside one category, not a benchmark result.
const part = (name, brand, category, price, stock, warranty, description, specs, build) => ({
  name, brand, category, price, stock, warranty, description, specs, build,
});

export const NEW_PARTS = [
  // ---------- Processors ----------
  part("AMD Ryzen 5 7600", "AMD", "processors", 58000, 12, "3 Years Brand Warranty",
    "6-core AM5 processor with a cooler in the box. A strong base for a mid-range gaming PC.",
    [["Cores / Threads", "6 / 12"], ["Max Boost", "5.1 GHz"], ["Socket", "AM5"], ["Cooler", "Wraith Stealth included"]],
    { socket: "AM5", score: 110 }),
  part("Intel Core i3-12100F", "Intel", "processors", 26000, 20, "3 Years Brand Warranty",
    "Budget 4-core processor for entry-level gaming builds. Needs a graphics card.",
    [["Cores / Threads", "4 / 8"], ["Max Turbo", "4.3 GHz"], ["Socket", "LGA 1700"], ["Integrated Graphics", "No"]],
    { socket: "LGA1700", score: 60 }),
  part("AMD Ryzen 5 5600", "AMD", "processors", 36000, 15, "3 Years Brand Warranty",
    "Popular 6-core AM4 processor that keeps platform costs low.",
    [["Cores / Threads", "6 / 12"], ["Max Boost", "4.4 GHz"], ["Socket", "AM4"], ["Cooler", "Wraith Stealth included"]],
    { socket: "AM4", score: 80 }),

  // ---------- Graphics cards ----------
  part("Zotac Gaming GeForce RTX 3050 6GB Twin Edge OC", "Zotac", "graphics-cards", 62000, 10, "2 Years Local Warranty",
    "Compact entry-level RTX card for 1080p gaming on a tight budget.",
    [["Memory", "6GB GDDR6"], ["Cooling", "Dual fan"], ["Features", "DLSS, Ray Tracing"]],
    { powerDraw: 450, score: 55 }),
  part("ASUS Dual GeForce RTX 4060 Ti OC 8GB", "ASUS", "graphics-cards", 135000, 6, "3 Years Local Warranty",
    "Dual-fan RTX 4060 Ti for high-refresh 1080p and comfortable 1440p gaming.",
    [["Memory", "8GB GDDR6"], ["Cooling", "Dual fan"], ["Features", "DLSS 3, Ray Tracing"]],
    { powerDraw: 550, score: 125 }),

  // ---------- Motherboards ----------
  part("MSI B650M Gaming Plus WiFi", "MSI", "motherboards", 52000, 6, "3 Years Local Warranty",
    "Micro-ATX AM5 motherboard with DDR5 support, PCIe 4.0 M.2 storage and built-in Wi-Fi 6E.",
    [["Socket", "AM5"], ["Chipset", "AMD B650"], ["Form Factor", "Micro-ATX"], ["Memory", "4x DDR5 slots"], ["Networking", "Wi-Fi 6E, 2.5G LAN"]],
    { socket: "AM5", ramType: "DDR5", score: 60 }),
  part("Gigabyte B650M DS3H", "Gigabyte", "motherboards", 45000, 8, "3 Years Local Warranty",
    "Affordable Micro-ATX AM5 board with DDR5 memory support.",
    [["Socket", "AM5"], ["Chipset", "AMD B650"], ["Form Factor", "Micro-ATX"], ["Memory", "4x DDR5 slots"], ["Networking", "2.5G LAN"]],
    { socket: "AM5", ramType: "DDR5", score: 50 }),
  part("MSI PRO B760M-A WiFi DDR4", "MSI", "motherboards", 42000, 7, "3 Years Local Warranty",
    "Micro-ATX Intel board that uses lower-cost DDR4 memory.",
    [["Socket", "LGA 1700"], ["Chipset", "Intel B760"], ["Form Factor", "Micro-ATX"], ["Memory", "4x DDR4 slots"], ["Networking", "Wi-Fi 6E, 2.5G LAN"]],
    { socket: "LGA1700", ramType: "DDR4", score: 50 }),
  part("Gigabyte B760M Gaming X AX (DDR5)", "Gigabyte", "motherboards", 50000, 5, "3 Years Local Warranty",
    "Micro-ATX Intel board with DDR5 support and built-in Wi-Fi.",
    [["Socket", "LGA 1700"], ["Chipset", "Intel B760"], ["Form Factor", "Micro-ATX"], ["Memory", "4x DDR5 slots"], ["Networking", "Wi-Fi 6E, 2.5G LAN"]],
    { socket: "LGA1700", ramType: "DDR5", score: 60 }),
  part("MSI B550M PRO-VDH WiFi", "MSI", "motherboards", 30000, 9, "3 Years Local Warranty",
    "Budget Micro-ATX AM4 board with Wi-Fi for Ryzen 5000 builds.",
    [["Socket", "AM4"], ["Chipset", "AMD B550"], ["Form Factor", "Micro-ATX"], ["Memory", "4x DDR4 slots"], ["Networking", "Wi-Fi, Gigabit LAN"]],
    { socket: "AM4", ramType: "DDR4", score: 40 }),

  // ---------- Memory ----------
  part("Kingston Fury Beast 16GB (2x8GB) DDR5 5200MHz", "Kingston", "storage-memory", 19000, 14, "Lifetime Brand Warranty",
    "Entry DDR5 dual-channel kit for current AMD and Intel platforms.",
    [["Capacity", "16GB (2x8GB)"], ["Type", "DDR5"], ["Speed", "5200MHz"]],
    { ramType: "DDR5", score: 60 }),
  part("Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz", "Corsair", "storage-memory", 12000, 20, "Lifetime Brand Warranty",
    "Low-profile DDR4 kit and a common choice for budget gaming builds.",
    [["Capacity", "16GB (2x8GB)"], ["Type", "DDR4"], ["Speed", "3200MHz"]],
    { ramType: "DDR4", score: 50 }),
  part("G.Skill Ripjaws V 32GB (2x16GB) DDR4 3600MHz", "G.Skill", "storage-memory", 22000, 10, "Lifetime Brand Warranty",
    "32GB DDR4 kit for heavier multitasking and editing on DDR4 boards.",
    [["Capacity", "32GB (2x16GB)"], ["Type", "DDR4"], ["Speed", "3600MHz"]],
    { ramType: "DDR4", score: 80 }),

  // ---------- Storage ----------
  part("Kingston NV2 1TB NVMe SSD", "Kingston", "storage-memory", 18500, 18, "3 Years Brand Warranty",
    "Good-value 1TB NVMe drive for games and everyday use.",
    [["Interface", "PCIe 4.0 NVMe M.2"], ["Read Speed", "Up to 3,500 MB/s"], ["Write Speed", "Up to 2,100 MB/s"], ["Capacity", "1TB"]],
    { score: 60 }),
  part("Crucial P3 500GB NVMe SSD", "Crucial", "storage-memory", 11000, 16, "5 Years Brand Warranty",
    "Compact starter NVMe drive for Windows and a few games.",
    [["Interface", "PCIe 3.0 NVMe M.2"], ["Read Speed", "Up to 3,500 MB/s"], ["Write Speed", "Up to 1,900 MB/s"], ["Capacity", "500GB"]],
    { score: 35 }),

  // ---------- Power supplies ----------
  part("Cooler Master MWE 550 Bronze V2", "Cooler Master", "power-supplies", 14000, 12, "5 Years Brand Warranty",
    "Reliable 550W unit for entry and mid-range builds.",
    [["Output", "550W"], ["Efficiency", "80 Plus Bronze"], ["Cables", "Non-modular"]],
    { wattage: 550, score: 40 }),
  part("Corsair CX650", "Corsair", "power-supplies", 19000, 10, "5 Years Brand Warranty",
    "650W power supply with room for a stronger graphics card.",
    [["Output", "650W"], ["Efficiency", "80 Plus Bronze"], ["Cables", "Non-modular"]],
    { wattage: 650, score: 55 }),
  part("Corsair RM750e", "Corsair", "power-supplies", 34000, 6, "7 Years Brand Warranty",
    "Quiet 750W Gold unit with fully modular cables for high-end builds.",
    [["Output", "750W"], ["Efficiency", "80 Plus Gold"], ["Cables", "Fully modular"]],
    { wattage: 750, score: 80 }),

  // ---------- Casings ----------
  part("Cooler Master MasterBox Q300L", "Cooler Master", "casings", 13000, 10, "1 Year Local Warranty",
    "Compact Micro-ATX case with magnetic dust filters.",
    [["Type", "Micro-ATX mini tower"], ["Side Panel", "Acrylic"], ["Extras", "Magnetic dust filters"]],
    { score: 40 }),
  part("Montech AIR 100 ARGB", "Montech", "casings", 19000, 8, "1 Year Local Warranty",
    "Airflow-focused Micro-ATX case that comes with four ARGB fans.",
    [["Type", "Micro-ATX tower"], ["Side Panel", "Tempered glass"], ["Fans", "4 ARGB fans included"]],
    { score: 60 }),
  part("Lian Li Lancool 216", "Lian Li", "casings", 32000, 4, "1 Year Local Warranty",
    "Roomy mid-tower with two large front fans for strong airflow.",
    [["Type", "ATX mid tower"], ["Side Panel", "Tempered glass"], ["Fans", "2x 160mm front fans included"]],
    { score: 85 }),

  // ---------- CPU coolers ----------
  part("DeepCool AK400", "DeepCool", "coolers", 9000, 15, "1 Year Local Warranty",
    "Single-tower air cooler that handles mid-range and gaming processors quietly.",
    [["Type", "Single tower air cooler"], ["Fan", "1x 120mm"], ["Heat Pipes", "4"]],
    { score: 50 }),
  part("DeepCool AK620", "DeepCool", "coolers", 18000, 8, "1 Year Local Warranty",
    "Dual-tower air cooler for hot high-end processors.",
    [["Type", "Dual tower air cooler"], ["Fans", "2x 120mm"], ["Heat Pipes", "6"]],
    { score: 85 }),
];

// Builder details for products that already exist in the catalog (matched by slug).
export const BUILD_INFO = {
  "msi-geforce-rtx-4060-ventus-2x-black-8g-oc": { powerDraw: 550, score: 100 },
  "gigabyte-geforce-rtx-4070-super-windforce-oc-12g": { powerDraw: 650, score: 170 },
  "sapphire-pulse-radeon-rx-7600-8gb": { powerDraw: 550, score: 90 },
  "intel-core-i5-13400f": { socket: "LGA1700", score: 100 },
  "amd-ryzen-7-7800x3d": { socket: "AM5", score: 170, needsCooler: true },
  "corsair-vengeance-32gb-2x16gb-ddr5-6000mhz": { ramType: "DDR5", score: 100 },
  "samsung-990-pro-1tb-nvme-ssd": { score: 100 },
};