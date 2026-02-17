import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { profile } from "@/data/resume-data";
import { getResumeUrl } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Home,
  Code2,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Mail,
  Sun,
  Moon,
  FileDown,
  Copy,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "#hero", icon: Home, shortcut: "H" },
  { label: "Skills", href: "#skills", icon: Code2, shortcut: "S" },
  { label: "Experience", href: "#experience", icon: Briefcase, shortcut: "E" },
  { label: "Projects", href: "#projects", icon: FolderGit2, shortcut: "P" },
  { label: "Education", href: "#education", icon: GraduationCap, shortcut: "D" },
  { label: "Contact", href: "#contact", icon: Mail, shortcut: "C" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  };

  const downloadCV = () => {
    setOpen(false);
    const a = document.createElement("a");
    a.href = getResumeUrl();
    a.download = "resume.pdf";
    a.click();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    toast.success("Email copied to clipboard");
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {navItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => scrollTo(item.href)}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              <CommandShortcut>{item.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={toggleTheme}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle Theme
            <CommandShortcut>T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={downloadCV}>
            <FileDown className="mr-2 h-4 w-4" />
            Download CV
            <CommandShortcut>⇧D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={copyEmail}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Email
            <CommandShortcut>⇧E</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
