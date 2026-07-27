import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0d0d14] border-t border-[#1e1e2e] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#c8a96e] flex items-center justify-center font-bold text-[#0a0a0f] text-sm shadow-lg shadow-[#c8a96e]/20">PC</div>
              <span className="font-serif text-lg font-bold text-[#e8e6e1]">PhotoConnect</span>
            </div>
            <p className="text-sm text-[#4a4a6a] leading-relaxed">India's premier marketplace connecting photographers and clients who value extraordinary moments.</p>
            <div className="flex gap-3 mt-5">
              {['📸','▶️','👥','🐦'].map((icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-[#1e1e2e] hover:bg-[#c8a96e]/10 hover:border-[#c8a96e]/30 border border-[#2a2a3a] flex items-center justify-center text-sm transition">{icon}</button>
              ))}
            </div>
          </div>

          {[
            { title: 'Explore', links: [['/', 'Browse Photographers'],['/?tab=feed','Photo & Video Feed'],['/register','Join as Photographer'],['/register','Book a Photographer']] },
            { title: 'Categories', links: [['/', 'Wedding Photography'],['/', 'Pre-Wedding Shoots'],['/', 'Modeling Portfolio'],['/', 'Wildlife Photography'],['/', 'Event Coverage']] },
            { title: 'Support', links: [['/', 'How It Works'],['/', 'Pricing Guide'],['/', 'Safety Tips'],['/', 'Contact Us']] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#c8a96e] mb-4">{title}</p>
              <div className="space-y-2.5">
                {links.map(([to, label]) => (
                  <Link key={label} to={to} className="block text-sm text-[#4a4a6a] hover:text-[#9a9890] transition">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1e1e2e] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#4a4a6a]">© 2024 PhotoConnect. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-[#4a4a6a]">
            <span className="hover:text-[#9a9890] cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-[#9a9890] cursor-pointer transition">Terms of Service</span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
