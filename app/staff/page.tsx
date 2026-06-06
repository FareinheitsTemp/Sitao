"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, fadeInUp } from "@/constants/motion";
import {
  IconCrown, IconShield, IconCode, IconGavel, IconUsers,
  IconBrandDiscord, IconArrowRight,
} from "@tabler/icons-react";

const ROLES = [
  {
    id: "supervisor",
    label: "Supervisor",
    sublabel: "Засновник",
    color: "#f59e0b",
    icon: IconCrown,
    description: "Засновник та головний адміністратор сервера",
    tier: 1,
  },
  {
    id: "admin",
    label: "Admin",
    sublabel: "Адміністратор",
    color: "#f87171",
    icon: IconShield,
    description: "Повноваження в управлінні сервером та гравцями",
    tier: 2,
  },
  {
    id: "tech_admin",
    label: "Tech Admin",
    sublabel: "Тех адмін",
    color: "#a78bfa",
    icon: IconCode,
    description: "Технічна підтримка та розробка сервера",
    tier: 2,
  },
  {
    id: "tech_mod",
    label: "Tech Mod",
    sublabel: "Тех мод",
    color: "#60a5fa",
    icon: IconCode,
    description: "Технічна модерація та підтримка гравців",
    tier: 3,
  },
  {
    id: "mod",
    label: "Moderator",
    sublabel: "Модератор",
    color: "#3d6bff",
    icon: IconGavel,
    description: "Стежить за порядком у грі та чаті",
    tier: 4,
  },
] as const;

const STAFF_MEMBERS = [
  { nickname: "Zver",      role: "supervisor", discord: "zver_sitao", avatar: null, description: "Засновник SITAO" },
  { nickname: "Admin_1",   role: "admin",      discord: null,         avatar: null, description: null },
  { nickname: "TechGuy",   role: "tech_admin", discord: null,         avatar: null, description: null },
  { nickname: "TechMod_1", role: "tech_mod",   discord: null,         avatar: null, description: null },
  { nickname: "Mod_1",     role: "mod",        discord: null,         avatar: null, description: null },
  { nickname: "Mod_2",     role: "mod",        discord: null,         avatar: null, description: null },
] as const;

type RoleId = typeof ROLES[number]["id"];

function getRole(roleId: string) {
  return ROLES.find((r) => r.id === roleId) ?? ROLES[ROLES.length - 1];
}

// ── Supervisor card (featured, full-width) ──
function SupervisorCard({ member }: { member: typeof STAFF_MEMBERS[number] }) {
  const role = getRole(member.role);
  const Icon = role.icon;
  const initials = member.nickname.slice(0, 2).toUpperCase();

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative col-span-full rounded-3xl bg-[var(--surface)] border overflow-hidden transition-all duration-300"
      style={{ borderColor: `${role.color}30` }}
    >
      {/* top gradient bar */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${role.color}, ${role.color}40, transparent)` }} />

      {/* ambient glow */}
      <div className="absolute top-0 left-0 w-96 h-48 rounded-full blur-3xl opacity-[0.07] pointer-events-none" style={{ background: role.color, transform: "translate(-30%,-40%)" }} />

      <div className="relative z-10 p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Avatar */}
        <div
          className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black select-none"
          style={{ background: `${role.color}20`, color: role.color, boxShadow: `0 0 24px ${role.color}25` }}
        >
          {member.avatar
            ? <img src={member.avatar} alt={member.nickname} className="w-full h-full rounded-2xl object-cover" />
            : initials
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <span className="text-2xl font-black tracking-tight">{member.nickname}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold" style={{ color: role.color, background: `${role.color}18` }}>
              <Icon size={12} />
              {role.label}
            </span>
          </div>
          {member.description && (
            <p className="text-sm text-[var(--muted)] mb-3">{member.description}</p>
          )}
          {member.discord && (
            <a
              href={`https://discord.com/users/${member.discord}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors border border-[#5865F2]/20"
            >
              <IconBrandDiscord size={13} />
              {member.discord}
            </a>
          )}
        </div>

        {/* Tier badge */}
        <div className="shrink-0 hidden sm:flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Рівень</span>
          <span className="text-3xl font-black" style={{ color: `${role.color}50` }}>01</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Regular staff card ──
function StaffCard({ member, index }: { member: typeof STAFF_MEMBERS[number]; index: number }) {
  const role = getRole(member.role);
  const Icon = role.icon;
  const initials = member.nickname.slice(0, 2).toUpperCase();

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative flex flex-col rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/30 transition-all duration-300 overflow-hidden"
    >
      {/* left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-3xl" style={{ background: `linear-gradient(to bottom, ${role.color}, transparent)` }} />

      {/* index watermark */}
      <span
        className="absolute -bottom-2 -right-1 text-[4.5rem] font-black leading-none select-none pointer-events-none"
        style={{ color: `${role.color}07` }}
      >
        {String(index).padStart(2, "0")}
      </span>

      {/* hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${role.color}0d, transparent 70%)` }}
      />

      <div className="relative z-10 p-5 pl-7">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black select-none"
            style={{ background: `${role.color}18`, color: role.color }}
          >
            {member.avatar
              ? <img src={member.avatar} alt={member.nickname} className="w-full h-full rounded-xl object-cover" />
              : initials
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-black text-base leading-tight">{member.nickname}</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                style={{ color: role.color, background: `${role.color}15` }}
              >
                <Icon size={10} />
                {role.label}
              </span>
            </div>
            {member.description && (
              <p className="text-xs text-[var(--muted)]">{member.description}</p>
            )}
          </div>
        </div>

        {/* Discord — visible on hover */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
          {member.discord ? (
            <a
              href={`https://discord.com/users/${member.discord}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[#5865F2] transition-colors"
            >
              <IconBrandDiscord size={13} />
              {member.discord}
            </a>
          ) : (
            <span className="text-xs text-[var(--muted)]/40 italic">Discord не вказано</span>
          )}
          <span
            className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200"
            style={{ color: role.color }}
          >
            Профіль <IconArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function StaffPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const grouped = ROLES.map((role) => ({
    role,
    members: STAFF_MEMBERS.filter((m) => m.role === role.id),
  })).filter((g) => g.members.length > 0);

  const totalStaff = STAFF_MEMBERS.length;

  return (
    <div className="min-h-screen pt-16" ref={ref}>

      {/* ── Hero ── */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #3d6bff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#3d6bff] opacity-[0.05] blur-[120px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <motion.div variants={fadeInUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3d6bff]/30 bg-[rgba(61,107,255,0.08)] text-[#5b84ff] text-xs font-semibold tracking-wide uppercase">
                  <IconUsers size={13} />
                  Команда сервера
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Персонал<br />
                <span style={{ background: "linear-gradient(135deg, #3d6bff 0%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>SITAO</span>
              </motion.h1>
            </div>
            <motion.p variants={fadeInUp} className="text-[var(--muted)] max-w-xs leading-relaxed text-sm lg:text-right">
              Познайомся з командою людей, які стежать за порядком, розвивають сервер та допомагають гравцям.
            </motion.p>
          </div>

          {/* divider + meta */}
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-10">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-mono text-[var(--muted)] px-2">{totalStaff} членів команди</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Role hierarchy legend ── */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center gap-2 flex-wrap"
          >
            {ROLES.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  variants={fadeInUp}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs"
                >
                  <Icon size={12} style={{ color: role.color }} />
                  <span className="font-semibold" style={{ color: role.color }}>{role.label}</span>
                  <span className="text-[var(--muted)]">— {role.description}</span>
                  {i < ROLES.length - 1 && (
                    <IconArrowRight size={10} className="ml-1 text-[var(--muted)]/40" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Staff grouped by role ── */}
      <section className="pb-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-14">
          {grouped.map(({ role, members }, groupIdx) => {
            const Icon = role.icon;
            const isSupervisor = role.id === "supervisor";
            return (
              <div key={role.id}>
                {/* Role section header */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="p-2 rounded-xl" style={{ background: `${role.color}15` }}>
                    <Icon size={18} style={{ color: role.color }} />
                  </div>
                  <div>
                    <h2 className="font-black text-lg leading-tight">{role.label}</h2>
                    <p className="text-xs text-[var(--muted)]">{role.description}</p>
                  </div>
                  <span
                    className="ml-2 text-xs font-mono px-2 py-0.5 rounded-lg border"
                    style={{ color: role.color, borderColor: `${role.color}30`, background: `${role.color}10` }}
                  >
                    {members.length}
                  </span>
                  <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${role.color}30, transparent)` }} />
                </motion.div>

                {/* Cards */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  className={isSupervisor
                    ? "grid grid-cols-1 gap-4"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  }
                >
                  {isSupervisor
                    ? members.map((m) => <SupervisorCard key={m.nickname} member={m} />)
                    : members.map((m, i) => <StaffCard key={m.nickname} member={m} index={groupIdx * 10 + i + 1} />)
                  }
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
