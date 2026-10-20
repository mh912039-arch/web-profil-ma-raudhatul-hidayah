'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const ContactLocation: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <section id="kontak" className="py-16 lg:py-24 bg-stone-100/70 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-madrasah-800 mb-2">
            <MapPin className="w-4 h-4 text-madrasah-600" />
            <span>Lokasi & Kontak Resmi</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-madrasah-950 tracking-tight leading-tight mb-3">
            Kunjungi Kampus & Jalin Silaturahmi
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Pintu madrasah kami senantiasa terbuka untuk silaturahmi wali santri, calon tamu kehormatan, dan kerja sama akademik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Campus Info & Embedded Map (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Info Bento */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-madrasah-50 text-madrasah-800 flex items-center justify-center flex-shrink-0 border border-madrasah-200/60">
                  <MapPin className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                    Alamat Madrasah
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {schoolData.profile.address}
                  </p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {schoolData.profile.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-madrasah-50 text-madrasah-800 flex items-center justify-center flex-shrink-0 border border-madrasah-200/60">
                  <Clock className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                    Jam Layanan Sekretariat
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {schoolData.profile.operatingHours}
                  </p>
                  <p className="text-xs text-madrasah-700 font-medium mt-0.5">
                    Ahad: Libur Kegiatan KBM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-madrasah-50 text-madrasah-800 flex items-center justify-center flex-shrink-0 border border-madrasah-200/60">
                  <Phone className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                    Telepon & WhatsApp
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Telp: {schoolData.profile.phone}
                  </p>
                  <a
                    href={`https://wa.me/${schoolData.profile.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-madrasah-700 hover:text-madrasah-900 font-semibold mt-0.5 block"
                  >
                    WA: {schoolData.profile.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-madrasah-50 text-madrasah-800 flex items-center justify-center flex-shrink-0 border border-madrasah-200/60">
                  <Mail className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                    Surel / Email Resmi
                  </h4>
                  <a
                    href={`mailto:${schoolData.profile.email}`}
                    className="text-xs text-madrasah-700 hover:text-madrasah-900 font-semibold break-all"
                  >
                    {schoolData.profile.email}
                  </a>
                  <p className="text-xs text-stone-500 mt-0.5">Respon maksimal 1x24 jam</p>
                </div>
              </div>

            </div>

            {/* Google Maps Preview Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-madrasah-950">Denah Lokasi Kampus MA Raudlatul Hidayah</span>
                <a
                  href="https://maps.app.goo.gl/4dKTkXuw5VBhmgACA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-madrasah-700 hover:text-madrasah-900 font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="relative h-64 sm:h-72 w-full bg-stone-200">
                <iframe
                  title="Peta Lokasi MA Raudlatul Hidayah - Mauk, Tangerang"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.6256247920387!2d106.53266297592476!3d-6.022493393963283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a077ff9292557%3A0xae9bc40d9fedd490!2sMA%20RAUDLATUL%20HIDAYAH!5e0!3m2!1sid!2sid!4v1728300000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Public Inquiry Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
            <h3 className="font-display text-xl font-bold text-madrasah-950 mb-2">
              Kirim Pesan Silaturahmi
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Sampaikan pertanyaan seputar profil, kunjungan studi, atau aspirasi kepada pengelola madrasah.
            </p>

            {formSubmitted ? (
              <div className="p-6 rounded-xl bg-madrasah-50 border border-madrasah-200 text-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-madrasah-600 mx-auto mb-3" />
                <h4 className="font-display text-lg font-bold text-madrasah-950 mb-1">
                  Pesan Berhasil Terkirim
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Terima kasih atas silaturahmi Anda. Tim sekretariat madrasah akan segera merespons melalui kontak yang Anda cantumkan.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', contact: '', subject: '', message: '' });
                  }}
                  className="px-4 py-2 rounded-lg bg-madrasah-900 text-white text-xs font-semibold hover:bg-madrasah-800 transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: H. Suparman"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-madrasah-900 focus:border-transparent transition-all placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nomor WhatsApp / Surel
                  </label>
                  <input
                    id="contact"
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Contoh: 08123456789 atau email@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-madrasah-900 focus:border-transparent transition-all placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Keperluan / Hal
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Contoh: Permohonan Kunjungan Studi"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-madrasah-900 focus:border-transparent transition-all placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Isi Pesan
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pesan atau pertanyaan Anda secara rinci di sini..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-madrasah-900 focus:border-transparent transition-all placeholder:text-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-madrasah-900 hover:bg-madrasah-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-madrasah-900 focus:ring-offset-2"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
