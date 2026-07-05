"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SignInButton,
  SignOutButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";

import {
  Sparkles,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

import { useChatStore } from "@/stores/chat-store";
import { PERSONA_LIST } from "@/lib/personas";

export function AppSidebar() {
  const { isSignedIn, user } = useUser();
  const { openUserProfile } = useClerk();

  const selectedPersonaId = useChatStore((s) => s.selectedPersonaId);
  const setSelectedPersona = useChatStore((s) => s.setSelectedPersona);

  return (
    <Sidebar className="border-r border-[#222d34] bg-[#111b21] text-zinc-200">
      {/* Header */}
      <SidebarHeader className="bg-[#111b21] p-4 pb-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="SoulSync"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-serif text-xl tracking-tight text-white">
            SoulSync
          </span>
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex flex-col gap-6 bg-[#111b21] px-3 pt-3">
        <div>
          <Button
            variant="ghost"
            className="h-10 w-full justify-start gap-3 rounded-lg px-3 text-[15px] font-normal text-zinc-300 transition-colors duration-200 hover:bg-[#202c33] hover:text-white"
          >
            <Sparkles className="h-4 w-4 text-zinc-400" />
            Docs
          </Button>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Personas
          </p>

          <div className="flex flex-col gap-1">
            {PERSONA_LIST.map((persona) => (
              <Button
                key={persona.id}
                variant="ghost"
                onClick={() => setSelectedPersona(persona.id)}
                className={`group h-12 w-full justify-start gap-3 rounded-lg px-3 text-zinc-300 transition-all duration-200 hover:bg-[#202c33] hover:text-white ${selectedPersonaId === persona.id && "bg-[#2a3942] text-white"
                  }`}
              >
                <Avatar className="h-8 w-8 shrink-0 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage src={persona.avatar} className="object-cover" />
                  <AvatarFallback className="bg-zinc-700 text-xs text-white">
                    AI
                  </AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col items-start">
                  <span className="truncate text-sm font-medium leading-tight">
                    {persona.name}
                  </span>
                  <span className="truncate text-xs leading-tight text-zinc-500 group-hover:text-zinc-400">
                    {persona.tagline}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-[#222d34] bg-[#111b21] p-3">
        {isSignedIn ? (
          <div className="flex w-full items-center gap-1 rounded-lg transition-colors duration-200 hover:bg-[#202c33]">
            {/* Clicking the profile itself opens Clerk's account modal */}
            <button
              onClick={() => openUserProfile()}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a884]/40"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium text-white">
                  {user?.fullName}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </button>

            {/* Chevron opens a small menu for quick actions */}
            <DropdownMenu>
              <DropdownMenuTrigger className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors duration-200 hover:bg-[#202c33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a884]/40">
                <ChevronsUpDown className="h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                className="border-[#2f3b43] bg-[#233138] text-white"
              >
                <DropdownMenuItem
                  onClick={() => openUserProfile()}
                  className="cursor-pointer focus:bg-[#2a3942]"
                >
                  Manage account
                </DropdownMenuItem>
                <SignOutButton>
                  <DropdownMenuItem className="cursor-pointer text-red-400 focus:bg-[#2a3942] focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <SignInButton mode="modal">
            <Button className="h-10 w-full rounded-lg bg-[#00a884] text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-[#06cf9c]">
              Login
            </Button>
          </SignInButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}