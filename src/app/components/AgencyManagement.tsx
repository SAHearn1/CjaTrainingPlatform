/**
 * Agency Management (#23)
 *
 * This page provides the admin UI for managing agencies/organizations.
 *
 * Required Supabase schema (migration pending — see issue #26):
 * ─────────────────────────────────────────────────────────────
 * CREATE TABLE agencies (
 *   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name        text NOT NULL,
 *   type        text NOT NULL,  -- e.g. 'law_enforcement', 'child_welfare', 'court'
 *   state       text NOT NULL,
 *   contact_email text,
 *   seat_count  integer NOT NULL DEFAULT 1,
 *   created_at  timestamptz NOT NULL DEFAULT now()
 * );
 *
 * ALTER TABLE user_profiles ADD COLUMN agency_id uuid REFERENCES agencies(id);
 *
 * Edge function endpoints needed:
 *   GET  /admin/agencies        — list all agencies
 *   POST /admin/agencies        — create agency
 *   PUT  /admin/agencies/:id    — update agency
 *   DELETE /admin/agencies/:id  — delete agency
 */
import { motion } from "motion/react";
import { Building2, Info } from "lucide-react";

export function AgencyManagement() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1">Agency Management</h1>
        <p className="text-muted-foreground text-sm">Manage organizations and their seat allocations.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border p-6 flex items-start gap-4"
        style={{ background: "rgba(30,58,95,0.04)" }}
      >
        <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-medium mb-1">Database migration required</p>
          <p className="text-sm text-muted-foreground">
            Agency management requires a Supabase PostgreSQL schema migration (issue #26) before this
            feature can go live. The <code className="bg-muted px-1 py-0.5 rounded text-xs">agencies</code> table
            and the <code className="bg-muted px-1 py-0.5 rounded text-xs">agency_id</code> column on user profiles
            must be created first.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Schema and edge function API stubs are documented in this component. Once the migration runs,
            remove this notice and wire the CRUD operations.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base">Agencies</h2>
        </div>

        {/* Placeholder empty state */}
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No agencies configured yet.</p>
          <p className="text-xs mt-1">Complete the database migration in issue #26 to enable agency management.</p>
        </div>
      </motion.div>
    </div>
  );
}
