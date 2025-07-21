import { User } from "@supabase/supabase-js";

export function getUserDisplayName(user: User | null): string {
  if (!user) return "Usuário";

  // 1. Prioridade: nome completo dos metadados
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }

  // 2. Nome do provedor (Google, etc.)
  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }

  // 3. Primeiro nome apenas
  if (user.user_metadata?.first_name) {
    return user.user_metadata.first_name;
  }

  // 4. Se tem given_name (Google)
  if (user.user_metadata?.given_name) {
    return user.user_metadata.given_name;
  }

  // 5. Email do provedor pode ter nome
  if (user.user_metadata?.email) {
    const emailName = user.user_metadata.email.split("@")[0];
    return formatName(emailName);
  }

  // 6. Fallback: primeira parte do email principal
  const emailName = user.email?.split("@")[0] || "Usuário";
  return formatName(emailName);
}

export function getUserFirstName(user: User | null): string {
  const fullName = getUserDisplayName(user);
  return fullName.split(" ")[0];
}

export function getUserInitials(user: User | null): string {
  if (!user) return "U";

  const fullName = getUserDisplayName(user);
  const names = fullName.split(" ");

  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }

  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

function formatName(name: string): string {
  // Remove números e caracteres especiais
  const cleanName = name.replace(/[0-9._-]/g, "");
  // Capitaliza primeira letra
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
}
