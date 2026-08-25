import { RiShieldFlashFill } from 'react-icons/ri'
import { FiTwitter, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const footerLinks = {
  Product: ['Dashboard', 'Analytics', 'Fleet Management', 'Hospital Network', 'API Docs'],
  Company: ['About Us', 'Careers', 'Press Kit', 'Blog', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'],
}

const socials = [
  { icon: <FiTwitter />, href: '#' },
  { icon: <FiGithub />, href: '#' },
  { icon: <FiLinkedin />, href: '#' },
  { icon: <FiMail />, href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center glow-cyan-sm">
                <RiShieldFlashFill className="text-cyan-400 text-lg" />
              </div>
              <span className="text-xl font-bold text-cyan-400">KavachAI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Next-generation AI emergency response platform protecting citizens and empowering first responders.
            </p>
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 glass-light rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} KavachAI Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
