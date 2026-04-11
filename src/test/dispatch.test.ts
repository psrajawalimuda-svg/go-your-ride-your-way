import { describe, it, expect, vi, beforeEach } from "vitest";
import { dispatch } from "@/lib/dispatch";
import { realtime } from "@/lib/realtime";

// Mock realtime
vi.mock("@/lib/realtime", () => ({
  realtime: {
    publish: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
    status: "connected",
  },
}));

describe("DispatchEngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should find best drivers sorted by score", () => {
    dispatch.init();
    const pickup: [number, number] = [-6.21, 106.84];
    const drivers = dispatch.findBestDrivers(pickup, 5);
    
    expect(drivers.length).toBeGreaterThan(0);
    // Score = distance - (rating - 4.0) * 2
    // Check if sorted by score
    for (let i = 0; i < drivers.length - 1; i++) {
      expect(drivers[i].score).toBeLessThanOrEqual(drivers[i+1].score);
    }
  });

  it("should return no_drivers if none are in radius", () => {
    dispatch.init();
    const pickup: [number, number] = [0, 0]; // Far from Jakarta
    const result = dispatch.requestRide(
      { label: "Remote", coords: pickup },
      { label: "Dest", coords: [-6, 106] },
      25000,
      "Test User"
    );
    
    return expect(result).resolves.toMatchObject({ success: false, reason: "no_drivers" });
  });

  it("should implement sequential dispatching with timeouts", async () => {
    dispatch.init();
    const pickup: [number, number] = [-6.21, 106.84];
    
    // Simulate first driver timeout and second driver acceptance
    let subscribeCount = 0;
    (realtime.subscribe as any).mockImplementation((channel, callback) => {
      subscribeCount++;
      const currentRequestId = `REQ-${Date.now()}`; // Simplified
      
      if (subscribeCount === 2) {
        // Second driver accepts
        setTimeout(() => {
          callback({
            requestId: (realtime.publish as any).mock.calls[1][1].requestId,
            accepted: true,
            driverId: (realtime.publish as any).mock.calls[1][1].driverId
          });
        }, 100);
      }
      return vi.fn();
    });

    const result = await dispatch.requestRide(
      { label: "Pickup", coords: pickup },
      { label: "Dropoff", coords: [-6.22, 106.85] },
      30000,
      "John Doe"
    );

    expect(result.success).toBe(true);
    expect(realtime.publish).toHaveBeenCalledTimes(2); // Two attempts
  });
});
