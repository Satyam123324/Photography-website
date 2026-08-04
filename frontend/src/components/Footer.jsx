import { Link } from 'react-router-dom'

const COLUMNS = [
  { title: 'Explore', links: [['/explore', 'Browse photographers'], ['/explore?type=feed', 'Photo & video feed'], ['/register', 'Join as photographer'], ['/explore', 'Book a photographer']] },
  { title: 'Categories', links: [['/explore?category=wedding', 'Wedding photography'], ['/explore?category=portrait', 'Portrait & fashion'], ['/explore?category=event', 'Event coverage'], ['/explore?category=wildlife', 'Wildlife & travel'], ['/explore?category=product', 'Product & commercial']] },
  { title: 'Support', links: [['/how-it-works', 'How it works'], ['/', 'Pricing guide'], ['/', 'Safety tips'], ['/', 'Contact us']] },
]

export default function Footer() {
  return (
    <footer className="bg-cream-200 border-t border-line mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-clay flex items-center justify-center font-bold text-white text-sm shadow-clay">PC</div>
              <span className="font-serif text-lg font-bold text-ink">PhotoConnect</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed">A marketplace connecting photographers of every kind with clients who value extraordinary moments.</p>
            <div className="flex gap-2.5 mt-5">
              {['📸', '▶️', '👥', '🐦'].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-surface border border-line hover:border-clay/40 hover:bg-clay-soft flex items-center justify-center text-sm transition">{icon}</button>
              ))}
            </div>
          </div>

          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-widest text-clay mb-4">{title}</p>
              <div className="space-y-2.5">
                {links.map(([to, label]) => (
                  <Link key={label} to={to} className="block text-sm text-ink-muted hover:text-clay-dark transition">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} PhotoConnect. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-ink-faint">
            <span className="hover:text-ink-muted cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-ink-muted cursor-pointer transition">Terms of Service</span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
