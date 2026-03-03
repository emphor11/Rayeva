import prisma from './src/repositories/prisma';

async function seed() {
    await prisma.product.createMany({
        data: [
            {
                name: "Sustainable Bamboo Office Desk",
                description: "Elegant desk made from 100% sustainable bamboo. FSC certified.",
                price: 450.0,
                primaryCategory: "Furniture",
                subCategory: "Office",
                tags: ["bamboo", "desk", "sustainable"],
                sustainabilityFilters: ["FSC Certified", "Sustainable material"]
            },
            {
                name: "Solar Powered Keyboard",
                description: "Wireless keyboard powered by light. No batteries required.",
                price: 85.0,
                primaryCategory: "Electronics",
                subCategory: "Peripherals",
                tags: ["solar", "keyboard", "battery-free"],
                sustainabilityFilters: ["Energy Efficient", "Solar Powered"]
            },
            {
                name: "Recycled Plastic Chair",
                description: "Ergonomic office chair made from 80% recycled ocean plastic.",
                price: 220.0,
                primaryCategory: "Furniture",
                subCategory: "Office",
                tags: ["recycled", "chair", "ocean plastic"],
                sustainabilityFilters: ["Recycled Content", "Ocean Plastic"]
            }
        ]
    });
    console.log("Seed data added!");
}

seed().catch(console.error);
