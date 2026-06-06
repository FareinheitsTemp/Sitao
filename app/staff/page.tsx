"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/constants/motion";
import {
  IconCrown, IconShield, IconCode, IconGavel, IconUsers,
  IconBrandDiscord,
} from "@tabler/icons-react";

const ROLES = [
  {
    id: "supervisor",
    label: "Supervisor",
    color: "#f59e0b",
    bg: "#f59e0b",
    icon: IconCrown,
    description: "Засновник та головний адміністратор сервера",
  },
  {
    id: "admin",
    label: "Admin",
    color: "#f87171",
    bg: "#f87171",
    icon: IconShield,
    description: "Повноваження в управлінні сервером та гравцями",
  },
  {
    id: "tech_admin",
    label: "Tech Admin",
    color: "#a78bfa",
    bg: "#a78bfa",
    icon: IconCode,
    description: "Технічна підтримка та розробка сервера",
  },
  {
    id: "tech_mod",
    label: "Tech Mod",
    color: "#60a5fa",
    bg: "#60a5fa",
    icon: IconCode,
    description: "Технічна модерація та підтримка гравців",
  },
  {
    id: "mod",
    label: "Moderator",
    color: "#4ade80",
    bg: "#4ade80",
    icon: IconGavel,
    description: "Стежить за порядком у грі та чаті",
  },
] as const;

// ======================================================
// ДАНІ ПЕРСОНАЛУ — замінюй тут на реальні нікнейми/discord
// ======================================================
const STAFF_MEMBERS = [
  {
    nickname: "Zver",
    role: "supervisor",
    discord: "zver_sitao",
    avatar: null, // або '/avatars/zver.png'
    description: "Засновник SITAO",
  },
  {
    nickname: "Admin_1",
    role: "admin",
    discord: null,
    avatar: null,
    description: null,
  },
  {
    nickname: "TechGuy",
    role: "tech_admin",
    discord: null,
    avatar: null,
    description: null,
  },
  {
    nickname: "TechMod_1",
    role: "tech_mod",
    discord: null,
    avatar: null,
    description: null,
  },
  {
    nickname: "Mod_1",
    role: "mod",
    discord: null,
    avatar: null,
    description: null,
  },
  {
    nickname: "Mod_2",
    role: "mod",
    discord: null,
    avatar: null,
    description: null,
  },
] as const;

type RoleId = typeof ROLES[number]["id"];

function getRole(roleId: string) {
  return ROLES.find((r) => r.id === roleId) ?? ROLES[ROLES.length - 1];
}

function StaffCard({ member }: { member: typeof STAFF_MEMBERS[number] }) {
  const role = getRole(member.role);
  const Icon = role.icon;

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--surface-2)] hover:bg-[var(--surface-2)] transition-all duration-200 overflow-hidden"
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none"
        style={{ background: role.color }}
      />

      <div className="relative z-10 flex items-center gap-4">
        {/* Avatar */}
        <div
          className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black select-none"
          style={{ background: `${role.color}18`, color: role.color }}
        >
          {member.avatar ? (
            <img src={member.avatar} alt={member.nickname} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            member.nickname.slice(0, 2).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base">{member.nickname}</span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold"
              style={{ color: role.color, background: `${role.color}18` }}
            >
              <Icon size={11} />
              {role.label}
            </span>
          </div>
          {member.description && (
            <p className="text-xs text-[var(--muted)] mt-0.5">{member.description}</p>
          )}
          {member.discord && (
            <a
              href={`https://discord.com/users/${member.discord}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1.5 text-xs text-[var(--muted)] hover:text-[#5865F2] transition-colors"
            >
              <IconBrandDiscord size={13} />
              {member.discord}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function StaffPage() {
  // Group by role order
  const grouped = ROLES.map((role) => ({
    role,
    members: STAFF_MEMBERS.filter((m) => m.role === role.id),
  })).filter((g) => g.members.length > 0);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#4ade80] opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4ade80]/25 bg-[#4ade80]/8 text-[#4ade80] text-sm font-medium mb-6">
            <IconUsers size={16} />
            Команда сервера
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Персонал{" "}
            <span className="text-[#4ade80]">SITAO</span>
          </h1>
          <p className="text-[var(--muted)] leading-relaxed max-w-md mx-auto text-sm sm:text-base">
            Познайомся з командою людей, які стежать за порядком, розвивають сервер та допомагають гравцям.
          </p>
        </div>
      </section>

      {/* Staff */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {grouped.map(({ role, members }) => {
            const Icon = role.icon;
            return (
              <div key={role.id}>
                {/* Role header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-1.5 rounded-xl" style={{ background: `${role.color}18` }}>
                    <Icon size={18} style={{ color: role.color }} />
                  </div>
                  <h2 className="font-black text-base tracking-tight">{role.label}</h2>
                  <span className="text-xs text-[var(--muted)] ml-1">{members.length}</span>
                  <div className="flex-1 h-px bg-[var(--border)] ml-2" />
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {members.map((m) => (
                    <StaffCard key={m.nickname} member={m} />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
