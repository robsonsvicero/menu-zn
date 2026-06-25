"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCircle, Upload } from "lucide-react";
import { updateUserProfileAction } from "../../actions";

type Props = {
  userProfile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    is_active: boolean | null;
    role_code: string;
  };
  availableRoles: { code: string; name: string }[];
  resetPasswordAction: (formData: FormData) => Promise<void>;
};

export default function EditarUsuarioForm({
  userProfile,
  availableRoles,
  resetPasswordAction,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(userProfile.avatar_url);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <>
      {/* Profile summary card */}
      <div className="mb-5 rounded-2xl border border-outline bg-white p-5 text-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-background border border-outline shrink-0 flex items-center justify-center">
          {preview ? (
            <Image src={preview} alt="Avatar" width={48} height={48} className="object-cover w-full h-full" unoptimized />
          ) : (
            <UserCircle size={28} className="text-on-surface/30" />
          )}
        </div>
        <div>
          <div className="font-medium">{userProfile.full_name ?? "Sem nome"}</div>
          <div className="text-on-surface/60">{userProfile.email}</div>
          <div className="text-xs text-on-surface/50 mt-0.5">ID: {userProfile.id}</div>
        </div>
      </div>

      {/* Profile form */}
      <form action={updateUserProfileAction} encType="multipart/form-data" className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <input type="hidden" name="user_id" value={userProfile.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nome completo</label>
            <input
              name="full_name"
              defaultValue={userProfile.full_name ?? ""}
              className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Avatar</label>

            <div
              className="flex items-center gap-3 rounded-xl border border-outline px-3 py-2 cursor-pointer hover:bg-background transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden bg-background border border-outline shrink-0 flex items-center justify-center">
                {preview ? (
                  <Image src={preview} alt="Avatar" width={32} height={32} className="object-cover w-full h-full" unoptimized />
                ) : (
                  <UserCircle size={18} className="text-on-surface/30" />
                )}
              </div>
              <span className="text-sm text-on-surface/60 truncate flex-1">
                {fileName ?? (userProfile.avatar_url ? "Clique para trocar" : "Selecionar imagem...")}
              </span>
              <Upload size={15} className="text-on-surface/40 shrink-0" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              name="avatar_file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Telefone</label>
            <input
              name="phone"
              defaultValue={userProfile.phone ?? ""}
              className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              name="role_code"
              defaultValue={userProfile.role_code}
              className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white"
            >
              {availableRoles.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={userProfile.is_active !== false}
            className="rounded border-outline"
          />
          Usuário ativo
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Salvar perfil
          </button>
          <Link
            href="/admin/usuarios"
            className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background"
          >
            Voltar
          </Link>
        </div>
      </form>

      {/* Reset password form */}
      <form
        action={resetPasswordAction}
        className="mt-5 rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-4"
      >
        <input type="hidden" name="user_id" value={userProfile.id} />
        <div>
          <h3 className="text-lg font-serif">Redefinir senha</h3>
          <p className="text-sm text-on-surface/70 mt-1">Defina uma nova senha com pelo menos 8 caracteres.</p>
        </div>

        <div className="max-w-md">
          <label className="block text-sm mb-1">Nova senha</label>
          <input
            name="new_password"
            type="password"
            minLength={8}
            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background"
        >
          Trocar senha
        </button>
      </form>
    </>
  );
}
