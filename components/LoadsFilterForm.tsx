"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LoadFilterRow = {
  id: string;
  load_number: string | null;
  pickup_date: string | null;
  status: string | null;
  driver_id: string | null;
  truck_id: string | null;
  drivers: { id: string; full_name: string | null; email: string | null } | null;
  trucks: { id: string; unit_number: string | null } | null;
};

type Props = {
  loads: LoadFilterRow[];
  initial: {
    from?: string;
    to?: string;
    driver?: string;
    truck?: string;
    status?: string;
    q?: string;
  };
};

export function LoadsFilterForm({ loads, initial }: Props) {
  const router = useRouter();

  const [from, setFrom] = useState(initial.from || "");
  const [to, setTo] = useState(initial.to || "");
  const [driver, setDriver] = useState(initial.driver || "");
  const [truck, setTruck] = useState(initial.truck || "");
  const [status, setStatus] = useState(initial.status || "");
  const [q, setQ] = useState(initial.q || "");

  const matchesBase = (load: LoadFilterRow) => {
    if (from && (!load.pickup_date || load.pickup_date < from)) return false;
    if (to && (!load.pickup_date || load.pickup_date > to)) return false;
    if (status && load.status !== status) return false;
    if (q && !(load.load_number || "").toLowerCase().includes(q.toLowerCase())) {
      return false;
    }
    return true;
  };

  const availableDrivers = useMemo(() => {
    const map = new Map<string, string>();
    for (const load of loads) {
      if (!matchesBase(load)) continue;
      if (truck && load.truck_id !== truck) continue;
      if (!load.driver_id || !load.drivers) continue;
      const label = load.drivers.full_name || load.drivers.email || "Driver";
      map.set(load.driver_id, label);
    }
    return Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [loads, from, to, truck, status, q]);

  const availableTrucks = useMemo(() => {
    const map = new Map<string, string>();
    for (const load of loads) {
      if (!matchesBase(load)) continue;
      if (driver && load.driver_id !== driver) continue;
      if (!load.truck_id || !load.trucks) continue;
      map.set(load.truck_id, `Unit ${load.trucks.unit_number}`);
    }
    return Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [loads, from, to, driver, status, q]);

  // If current selection disappears from available options, clear it
  useMemo(() => {
    if (driver && !availableDrivers.some((d) => d.id === driver)) {
      setDriver("");
    }
  }, [availableDrivers, driver]);

  useMemo(() => {
    if (truck && !availableTrucks.some((t) => t.id === truck)) {
      setTruck("");
    }
  }, [availableTrucks, truck]);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (driver) params.set("driver", driver);
    if (truck) params.set("truck", truck);
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const qs = params.toString();
    router.push(qs ? `/admin/loads?${qs}` : "/admin/loads");
  };

  const clearFilters = () => {
    setFrom("");
    setTo("");
    setDriver("");
    setTruck("");
    setStatus("");
    setQ("");
    router.push("/admin/loads");
  };

  return (
    <form
      onSubmit={applyFilters}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pickup From
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pickup To
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Driver
          </label>
          <select
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Drivers</option>
            {availableDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Truck
          </label>
          <select
            value={truck}
            onChange={(e) => setTruck(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Trucks</option>
            {availableTrucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Load #
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search load #"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Filter
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Clear
        </button>
      </div>
    </form>
  );
}