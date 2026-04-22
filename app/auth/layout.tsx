export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1033] to-[#0A0A0F]">
      {children}
    </div>
  )
}
