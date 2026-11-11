// Starter catalog. Prices are sample PKR figures, not live market rates.
// specs are [label, value] pairs; the seed route converts them.
export const PRODUCTS = [
  // ---------- Graphics cards ----------
  {
    name: "MSI GeForce RTX 4060 Ventus 2X Black 8G OC",
    brand: "MSI", category: "graphics-cards", price: 105000, oldPrice: 112000, stock: 8,
    warranty: "3 Years Local Warranty", featured: true,
    description: "Compact dual-fan RTX 4060 for smooth 1080p gaming with DLSS 3 and ray tracing.",
    specs: [["Memory", "8GB GDDR6"], ["Outputs", "1x HDMI 2.1a, 3x DisplayPort 1.4a"], ["Recommended PSU", "550W"], ["Features", "DLSS 3, Ray Tracing"]],
  },
  {
    name: "Gigabyte GeForce RTX 4070 Super Windforce OC 12G",
    brand: "Gigabyte", category: "graphics-cards", price: 215000, stock: 4,
    warranty: "3 Years Local Warranty", featured: true,
    description: "Triple-fan RTX 4070 Super built for high-refresh 1440p gaming.",
    specs: [["Memory", "12GB GDDR6"], ["Cooling", "Windforce triple fan"], ["Recommended PSU", "650W"], ["Features", "DLSS 3, Ray Tracing"]],
  },
  {
    name: "Sapphire Pulse Radeon RX 7600 8GB",
    brand: "Sapphire", category: "graphics-cards", price: 92000, stock: 6,
    warranty: "2 Years Local Warranty",
    description: "Value 1080p card with AMD FSR support and a quiet dual-fan cooler.",
    specs: [["Memory", "8GB GDDR6"], ["Cooling", "Dual fan"], ["Recommended PSU", "550W"], ["Features", "AMD FSR"]],
  },

  // ---------- Processors ----------
  {
    name: "Intel Core i5-13400F",
    brand: "Intel", category: "processors", price: 55000, stock: 15,
    warranty: "3 Years Brand Warranty",
    description: "10-core desktop processor that pairs well with mid-range graphics cards.",
    specs: [["Cores / Threads", "10 (6P + 4E) / 16"], ["Max Turbo", "4.6 GHz"], ["Socket", "LGA 1700"], ["Integrated Graphics", "No"]],
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD", category: "processors", price: 125000, oldPrice: 135000, stock: 5,
    warranty: "3 Years Brand Warranty", featured: true,
    description: "8-core gaming processor with 3D V-Cache for top-tier frame rates.",
    specs: [["Cores / Threads", "8 / 16"], ["Max Boost", "5.0 GHz"], ["Socket", "AM5"], ["L3 Cache", "96MB"]],
  },

  // ---------- Laptops ----------
  {
    name: "ASUS TUF Gaming F15 (Core i5-12500H, RTX 3050)",
    brand: "ASUS", category: "laptops", price: 285000, stock: 3,
    warranty: "1 Year Local Warranty",
    description: "Tough entry-level gaming laptop with a 144Hz display.",
    specs: [["Processor", "Intel Core i5-12500H"], ["Graphics", "GeForce RTX 3050 4GB"], ["Display", "15.6\" FHD 144Hz"], ["Memory / Storage", "16GB RAM, 512GB SSD"]],
  },
  {
    name: "Lenovo LOQ 15 (Ryzen 7 7840HS, RTX 4060)",
    brand: "Lenovo", category: "laptops", price: 365000, oldPrice: 385000, stock: 2,
    warranty: "1 Year Local Warranty", featured: true,
    description: "Balanced gaming laptop with an RTX 4060 and a fast Ryzen 7 processor.",
    specs: [["Processor", "AMD Ryzen 7 7840HS"], ["Graphics", "GeForce RTX 4060 8GB"], ["Display", "15.6\" FHD 144Hz"], ["Memory / Storage", "16GB DDR5, 512GB SSD"]],
  },

  // ---------- Monitors ----------
  {
    name: "ASUS TUF Gaming VG249Q1A 24\" 165Hz",
    brand: "ASUS", category: "monitors", price: 52000, stock: 10,
    warranty: "3 Years Local Warranty",
    description: "Fast 1080p IPS monitor for competitive gaming on a budget.",
    specs: [["Panel", "23.8\" IPS, Full HD"], ["Refresh Rate", "165Hz"], ["Response Time", "1ms MPRT"], ["Sync", "FreeSync Premium"]],
  },
  {
    name: "MSI G274QPF-QD 27\" QHD 170Hz",
    brand: "MSI", category: "monitors", price: 98000, stock: 4,
    warranty: "3 Years Local Warranty",
    description: "Sharp 1440p Rapid IPS panel with quantum dot colour.",
    specs: [["Panel", "27\" Rapid IPS, 2560 x 1440"], ["Refresh Rate", "170Hz"], ["Response Time", "1ms GtG"], ["Sync", "G-Sync Compatible"]],
  },

  // ---------- Keyboards ----------
  {
    name: "VOLT K65 Custom Mechanical Keyboard",
    brand: "VOLT", category: "keyboards", price: 24999, stock: 20,
    warranty: "1 Year VOLT Warranty", featured: true,
    description: "Our own 65% hot-swap keyboard. Design the case, keycaps and glow in the 3D configurator.",
    specs: [["Layout", "65%, 68 keys"], ["Switches", "Hot-swap: Linear, Tactile or Clicky"], ["Lighting", "Per-key RGB"], ["Connection", "USB-C"]],
  },
  {
    name: "Redragon K552 Kumara RGB",
    brand: "Redragon", category: "keyboards", price: 9500, stock: 25,
    warranty: "1 Year Local Warranty",
    description: "Popular budget tenkeyless mechanical keyboard with a metal top plate.",
    specs: [["Layout", "Tenkeyless, 87 keys"], ["Switches", "Outemu Blue"], ["Lighting", "RGB backlight"], ["Connection", "Wired USB"]],
  },
  {
    name: "Razer BlackWidow V4 X",
    brand: "Razer", category: "keyboards", price: 32000, stock: 6,
    warranty: "2 Years Local Warranty",
    description: "Full-size mechanical keyboard with macro keys and Chroma RGB.",
    specs: [["Layout", "Full size"], ["Switches", "Razer Green mechanical"], ["Lighting", "Razer Chroma RGB"], ["Extras", "6 dedicated macro keys"]],
  },

  // ---------- Mice ----------
  {
    name: "Logitech G502 HERO",
    brand: "Logitech", category: "mice", price: 13500, oldPrice: 15000, stock: 18,
    warranty: "2 Years Local Warranty", featured: true,
    description: "Classic wired gaming mouse with adjustable weights and 11 buttons.",
    specs: [["Sensor", "HERO 25K"], ["Buttons", "11 programmable"], ["Connection", "Wired USB"], ["Extras", "Adjustable weights"]],
  },
  {
    name: "Logitech G304 Lightspeed Wireless",
    brand: "Logitech", category: "mice", price: 9000, stock: 30,
    warranty: "2 Years Local Warranty",
    description: "Lightweight wireless mouse with long battery life.",
    specs: [["Sensor", "HERO 12K"], ["Connection", "Lightspeed 2.4GHz wireless"], ["Battery", "Up to 250 hours (1x AA)"], ["Weight", "99g"]],
  },
  {
    name: "Razer DeathAdder V3",
    brand: "Razer", category: "mice", price: 22000, stock: 7,
    warranty: "2 Years Local Warranty",
    description: "Ultra-light ergonomic esports mouse with an 8000Hz polling rate.",
    specs: [["Sensor", "Focus Pro 30K"], ["Weight", "59g"], ["Polling Rate", "Up to 8000Hz"], ["Connection", "Wired USB"]],
  },

  // ---------- Headsets ----------
  {
    name: "HyperX Cloud II",
    brand: "HyperX", category: "headsets", price: 21000, stock: 12,
    warranty: "2 Years Local Warranty",
    description: "Comfortable gaming headset with virtual 7.1 surround sound.",
    specs: [["Drivers", "53mm"], ["Surround", "Virtual 7.1"], ["Microphone", "Detachable, noise-cancelling"], ["Connection", "USB / 3.5mm"]],
  },
  {
    name: "Razer BlackShark V2 X",
    brand: "Razer", category: "headsets", price: 13500, stock: 14,
    warranty: "2 Years Local Warranty",
    description: "Lightweight esports headset with a clear cardioid microphone.",
    specs: [["Drivers", "50mm TriForce"], ["Surround", "7.1"], ["Weight", "240g"], ["Connection", "3.5mm"]],
  },

  // ---------- Consoles ----------
  {
    name: "Sony PlayStation 5 Slim (Disc Edition)",
    brand: "Sony", category: "consoles", price: 175000, stock: 5,
    warranty: "1 Year Local Warranty", featured: true,
    description: "The slimmer PS5 with a disc drive and a DualSense controller in the box.",
    specs: [["Storage", "1TB SSD"], ["Output", "4K, up to 120fps"], ["Drive", "Ultra HD Blu-ray"], ["In the Box", "DualSense wireless controller"]],
  },
  {
    name: "Xbox Series S 512GB",
    brand: "Microsoft", category: "consoles", price: 95000, stock: 6,
    warranty: "1 Year Local Warranty",
    description: "Compact all-digital console for 1440p gaming.",
    specs: [["Storage", "512GB SSD"], ["Output", "1440p, up to 120fps"], ["Drive", "None (all-digital)"], ["In the Box", "Xbox wireless controller"]],
  },
  {
    name: "Nintendo Switch OLED Model",
    brand: "Nintendo", category: "consoles", price: 98000, stock: 0,
    warranty: "1 Year Local Warranty",
    description: "Hybrid console with a vivid 7-inch OLED screen.",
    specs: [["Display", "7\" OLED"], ["Storage", "64GB"], ["Dock", "With wired LAN port"], ["Modes", "TV, tabletop, handheld"]],
  },

  // ---------- Storage & memory ----------
  {
    name: "Samsung 990 PRO 1TB NVMe SSD",
    brand: "Samsung", category: "storage-memory", price: 36000, stock: 16,
    warranty: "5 Years Brand Warranty",
    description: "High-end PCIe 4.0 SSD for fast game loading.",
    specs: [["Interface", "PCIe 4.0 NVMe M.2"], ["Read Speed", "Up to 7,450 MB/s"], ["Write Speed", "Up to 6,900 MB/s"], ["Capacity", "1TB"]],
  },
  {
    name: "Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz",
    brand: "Corsair", category: "storage-memory", price: 38000, stock: 9,
    warranty: "Lifetime Brand Warranty",
    description: "Dual-channel DDR5 kit tuned for current gaming platforms.",
    specs: [["Capacity", "32GB (2x16GB)"], ["Type", "DDR5"], ["Speed", "6000MHz"], ["Profile", "Intel XMP 3.0"]],
  },
];