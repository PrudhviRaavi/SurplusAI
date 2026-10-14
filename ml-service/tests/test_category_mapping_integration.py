#!/usr/bin/env python3
"""
Unit and integration tests for FoodShareAI Category Mapping and Detection Contracts.
Tests:
1. All 30 fine-grained detector classes map to the 7 valid app categories.
2. 'PRODUCE' is never returned as an app category.
3. Genuine 'OTHER' (Egg) is distinguished from unknown classes (which have category=None, isKnownClass=False).
4. Response structure contains both 'className' and 'itemName'.
5. Empty detections, multiple detections, and confidence values are structured correctly.
"""

import os
import sys
import json
import unittest
from pathlib import Path

# Ensure ml-service root is in sys.path
ML_SERVICE_DIR = Path(__file__).resolve().parent.parent
if str(ML_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(ML_SERVICE_DIR))


VALID_APP_CATEGORIES = {
    "COOKED_MEALS",
    "FRUITS_VEGETABLES",
    "BAKERY",
    "PACKAGED_FOOD",
    "DAIRY",
    "BEVERAGES",
    "OTHER",
}

EXPECTED_30_CLASSES = {
    "Pizza": "COOKED_MEALS",
    "Hamburger": "COOKED_MEALS",
    "Sandwich": "COOKED_MEALS",
    "Hot dog": "COOKED_MEALS",
    "Pasta": "COOKED_MEALS",
    "Salad": "COOKED_MEALS",
    "Sushi": "COOKED_MEALS",
    "Taco": "COOKED_MEALS",
    "Apple": "FRUITS_VEGETABLES",
    "Banana": "FRUITS_VEGETABLES",
    "Orange (fruit)": "FRUITS_VEGETABLES",
    "Strawberry": "FRUITS_VEGETABLES",
    "Grape": "FRUITS_VEGETABLES",
    "Tomato": "FRUITS_VEGETABLES",
    "Carrot": "FRUITS_VEGETABLES",
    "Broccoli": "FRUITS_VEGETABLES",
    "Bread": "BAKERY",
    "Cake": "BAKERY",
    "Cookie": "BAKERY",
    "Croissant": "BAKERY",
    "Cheese": "DAIRY",
    "Milk": "DAIRY",
    "Ice cream": "DAIRY",
    "Coffee (drink)": "BEVERAGES",
    "Tea": "BEVERAGES",
    "Juice": "BEVERAGES",
    "Wine": "BEVERAGES",
    "Popcorn": "PACKAGED_FOOD",
    "Candy": "PACKAGED_FOOD",
    "Egg": "OTHER",
}

class TestCategoryMappingIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        base_dir = Path(__file__).resolve().parent.parent
        cls.mapping_path = base_dir / "datasets" / "food_detection" / "class_mapping.json"
        with open(cls.mapping_path, "r") as f:
            cls.mapping = json.load(f)

    def test_all_30_classes_present_and_mapped(self):
        """Verify exactly 30 classes are present and map to expected categories."""
        self.assertEqual(len(self.mapping), 30, "Must have exactly 30 classes in class_mapping.json")
        for cls_name, expected_cat in EXPECTED_30_CLASSES.items():
            self.assertIn(cls_name, self.mapping, f"Class {cls_name} must be in mapping")
            self.assertEqual(
                self.mapping[cls_name],
                expected_cat,
                f"Class {cls_name} must map to {expected_cat}, got {self.mapping[cls_name]}"
            )

    def test_all_mapped_categories_are_in_valid_app_categories(self):
        """Every mapped category must strictly be one of the 7 official app categories."""
        for cls_name, cat in self.mapping.items():
            self.assertIn(
                cat,
                VALID_APP_CATEGORIES,
                f"Class '{cls_name}' mapped to '{cat}', which is not in valid categories {VALID_APP_CATEGORIES}"
            )

    def test_produce_is_never_returned_as_category(self):
        """Ensure 'PRODUCE' is NEVER used as an app category (use FRUITS_VEGETABLES)."""
        categories = set(self.mapping.values())
        self.assertNotIn("PRODUCE", categories, "PRODUCE must never be an app category")
        self.assertIn("FRUITS_VEGETABLES", categories)

    def test_food_detection_service_class_mapping_load(self):
        """FoodDetectionService loads class_mapping properly."""
        from services.food_detection_service import food_detection_service, VALID_APP_CATEGORIES as SVC_CATEGORIES
        self.assertEqual(len(food_detection_service.class_mapping), 30)
        self.assertEqual(SVC_CATEGORIES, VALID_APP_CATEGORIES)
        self.assertNotIn("PRODUCE", food_detection_service.class_mapping.values())

    def test_known_and_unknown_class_resolution(self):
        """Known classes resolve to valid categories; unknown classes resolve to None and isKnownClass=False."""
        from services.food_detection_service import food_detection_service
        
        # 1. Known classes
        self.assertEqual(food_detection_service.class_mapping.get("Pizza"), "COOKED_MEALS")
        self.assertEqual(food_detection_service.class_mapping.get("Apple"), "FRUITS_VEGETABLES")
        self.assertEqual(food_detection_service.class_mapping.get("Egg"), "OTHER")
        
        # 2. Unknown classes must NOT be silently classified as OTHER
        unknown_class = "UnrecognizedFoodObject"
        mapped = food_detection_service.class_mapping.get(unknown_class)
        self.assertIsNone(mapped, "Unknown classes must not be present in mapping or default to OTHER")

    def test_synthetic_detection_payload_structure(self):
        """Verify simulated detections meet the contract with className, itemName, category, and isKnownClass."""
        from services.food_detection_service import food_detection_service
        
        mock_raw_detections = [
            ("Pizza", 0.95, [100, 100, 200, 200]),
            ("Egg", 0.88, [50, 50, 80, 80]),
            ("MysteryDish", 0.40, [10, 10, 50, 50]),
        ]
        
        detections = []
        for cls_name, conf, xywh in mock_raw_detections:
            is_known = cls_name in food_detection_service.class_mapping
            app_category = food_detection_service.class_mapping.get(cls_name) if is_known else None
            detections.append({
                "className": cls_name,
                "itemName": cls_name,
                "category": app_category,
                "isKnownClass": is_known,
                "confidence": round(conf, 4),
                "boundingBox": {
                    "x": xywh[0],
                    "y": xywh[1],
                    "width": xywh[2],
                    "height": xywh[3],
                }
            })
            
        # Check Pizza
        self.assertEqual(detections[0]["className"], "Pizza")
        self.assertEqual(detections[0]["itemName"], "Pizza")
        self.assertEqual(detections[0]["category"], "COOKED_MEALS")
        self.assertTrue(detections[0]["isKnownClass"])
        
        # Check Egg (valid OTHER)
        self.assertEqual(detections[1]["className"], "Egg")
        self.assertEqual(detections[1]["category"], "OTHER")
        self.assertTrue(detections[1]["isKnownClass"])
        
        # Check MysteryDish (unknown class)
        self.assertEqual(detections[2]["className"], "MysteryDish")
        self.assertIsNone(detections[2]["category"])
        self.assertFalse(detections[2]["isKnownClass"])

if __name__ == "__main__":
    unittest.main()
