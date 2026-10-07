# myKouch — New Product Categories Guide

## Categories Added
1. **Mattress & Beddings**
   - **Slug**: `mattress-beddings`
   - **Display Name**: `Mattress & Beddings`
   - **Direct URL**: `/collections?category=mattress-beddings` or `/category/mattress-beddings`
   - **Cover Image**: `/assets/categories/mattress_beddings_cover.jpg`
   - **Description**: Orthopedic memory foam mattresses, pocketed spring systems, and hotel-grade luxury beddings crafted for rejuvenating sleep.

2. **Pillow & Cushion**
   - **Slug**: `pillow-cushion`
   - **Display Name**: `Pillow & Cushion`
   - **Direct URL**: `/collections?category=pillow-cushion` or `/category/pillow-cushion`
   - **Cover Image**: `/assets/categories/pillow_cushion_cover.jpg`
   - **Description**: Plush decorative throw cushions, memory-foam neck pillows, and bouclé accent pads tailored for bespoke living comfort.

---

## How to Add Products under These Categories

### Option 1: Via the Owner Portal (Recommended)
1. Navigate to `/owner/login` and log in with your credentials (`admin@mykouch.in`).
2. Go to the **Products** tab and click **"Add New Product"**.
3. In the modal:
   - Select **Category**: `Mattress & Beddings` or `Pillow & Cushion`.
   - Enter **Product Name** (e.g., `myKouch Orthopedic Memory Foam Mattress` or `myKouch Bouclé Accent Cushion Set`).
   - Enter **Size / Capacity** (e.g., `King Size (72" x 78")`, `Queen Size`, or `Set of 4`).
   - Enter **Price** and optional **Original Price**.
   - Enter **Dimensions** and **Description**.
   - Upload high-resolution product photos directly from your computer.
4. Click **Save Product**. The product will immediately become live in that category!

### Option 2: Via API / Database Seed
Products can be created using `POST /api/products` (Authenticated as Owner):
```json
{
  "name": "myKouch Orthopedic Dual-Comfort Mattress",
  "category": "Mattress & Beddings",
  "price": 28999,
  "originalPrice": 38999,
  "dimensions": "78\" L x 72\" W x 8\" Thick",
  "seatingCapacity": "King Size",
  "images": ["/assets/categories/mattress_beddings_cover.jpg"],
  "description": "High-resilience orthopedic mattress with dual-comfort layers and breathable bamboo fabric quilting.",
  "isNewArrival": true,
  "isActive": true
}
```

---

## Replacing Temporary Category Assets
To replace the category cover images with client-provided photography at any time:
- Overwrite `client/public/assets/categories/mattress_beddings_cover.jpg`
- Overwrite `client/public/assets/categories/pillow_cushion_cover.jpg`
Rebuilding or refreshing will immediately show the new assets without needing code changes.
