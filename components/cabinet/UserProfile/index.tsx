"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { IconNotes, IconUsers, IconGift, IconBook, IconMenu2, IconX, IconHome } from "@tabler/icons-react";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/",       label: "Головна",  icon: IconHome },
  { href: "/posts",  label: "Новини",   icon: IconNotes },
  { href: "/staff",  label: "Персонал", icon: IconUsers },
  { href: "/rules",  label: "Правила",  icon: IconBook },
  { href: "/donate", label: "Донат",    icon: IconGift },
];

