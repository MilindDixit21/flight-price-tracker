#!/bin/bash

# Quick API Test Script for Flight Price Tracker
# Run: ./tests/quick-tests.sh

echo "Starting quick API tests..."
BASE_URL="http://localhost:5000/api/flights"

echo ""
echo "Testing /test endpoint..."
curl -s -w "\nStatus: %{http_code}\n" $BASE_URL/test
# Expect: { ok:true, message:'Server + DB ready' }

echo ""
echo "Testing /search endpoint..."
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/search?origin=JFK&destination=LAX"
# Expect: { ok:true, data:[...mock data...] }

echo ""
echo "Tests completed!"
