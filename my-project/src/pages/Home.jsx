import { Link } from "react-router-dom";
import { FaChartLine, FaUserSecret, FaRobot, FaLightbulb, FaCalendarAlt, FaBookOpen, FaDatabase, FaGlobe, FaBinoculars, FaArrowDown } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarMain from "../components/NavbarMain";
import 'animate.css';


export default function Home() {
  const scrollRef = useRef(null);

  const faqs = [
    {
      q: "Üyelik ücretli mi?",
      a: "Hayır, TechRadar'ı ücretsiz kullanabilirsiniz."
    },
    {
      q: "Hangi sektörlere uygun?",
      a: "Özellikle teknoloji, yazılım ve girişimcilik sektörlerine odaklanıyoruz."
    },
    {
      q: "Veriler nasıl güncelleniyor?",
      a: "Veriler haftalık olarak güncellenir ve doğrulanır."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    let animationFrameId;

    const scroll = () => {
      scrollAmount += 0.5;
      if (scrollContainer) {
        scrollContainer.scrollLeft = scrollAmount;
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const features = [
    { icon: <FaChartLine size={30} className="text-indigo-600" />, title: "Sektör Trendleri Takibi", desc: "Şirketini geleceğe hazırlayan teknoloji trendlerini keşfet." },
    { icon: <FaUserSecret size={30} className="text-indigo-600" />, title: "Rakiplerin Stratejileri", desc: "Doğrudan rakip şirketlerinin adımlarını analiz et." },
    { icon: <FaRobot size={30} className="text-indigo-600" />, title: "Yapay Zeka ile Büyüme", desc: "AI destekli tavsiyelerle işini büyüt." },
    { icon: <FaLightbulb size={30} className="text-indigo-600" />, title: "Kişiye Özel İçerik", desc: "Seçtiğin teknoloji alanlarına göre öneriler al." },
    { icon: <FaCalendarAlt size={30} className="text-indigo-600" />, title: "Etkinlikler ve Zirveler", desc: "Alanındaki en prestijli etkinliklere ilk sen ulaş." },
    { icon: <FaBookOpen size={30} className="text-indigo-600" />, title: "Medium'dan İlham Al", desc: "Uzmanların yazdığı özel makaleleri keşfet." },
    { icon: <FaDatabase size={30} className="text-indigo-600" />, title: "Veriye Dayalı Karar", desc: "Sadece hislerinle değil, verilerle yönet." },
    { icon: <FaGlobe size={30} className="text-indigo-600" />, title: "Pazar Fırsatları", desc: "Yeni açılan fırsatları ve trendleri kaçırma." },
    { icon: <FaBinoculars size={30} className="text-indigo-600" />, title: "Geleceği Öngör", desc: "Henüz yaygınlaşmamış yenilikleri ilk öğren." }
  ];
const testimonials = [
  { name: "Ayşe K.", title: "Startup CEO", comment: "TechRadar sayesinde rakiplerimin 6 ay önünde planlama yapabildim. Harika bir platform!" },
  { name: "Mert T.", title: "CTO", comment: "Yapay zeka destekli tavsiyeler ile çok daha hızlı büyüdük. Gerçekten etkileyici." },
  { name: "Selin B.", title: "Pazarlama Müdürü", comment: "Medium makaleleri ve pazar trendleri sayesinde doğru zamanda doğru adımı attık!" }
];

const steps = [
  { step: 1, title: "Üye Ol", desc: "Kolayca kaydol ve giriş yap." },
  { step: 2, title: "Şirket Bilgilerini Gir", desc: "Şirketini tanımla ve sektörünü seç." },
  { step: 3, title: "Teknoloji Alanı Seç", desc: "İlgi duyduğun teknolojik alt alanları belirle." },
  { step: 4, title: "Analizleri Al", desc: "Sana özel üretilen önerilerle büyümeye başla." }
];

  return (
<>
      <NavbarMain />   {/* ← Bunu buraya koyacaksın */}


<section className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex flex-col  relative overflow-hidden">

        {/* Dalga Efekti */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">

          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#6366f1" fillOpacity="1"
                  d="M0,32L40,42.7C80,53,160,75,240,106.7C320,139,400,181,480,186.7C560,192,640,160,720,154.7C800,149,880,171,960,165.3C1040,160,1120,128,1200,128C1280,128,1360,160,1400,176L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
          </svg>
        </div>

        {/* Hero */}
        <div className="cssanimation hu__hu__ flex flex-col justify-center items-center text-center py-24 px-6 relative z-10">
          <h1 className="animate__animated animate__rotateInUpLeft animate__repeat-1 text-5xl font-bold text-white mb-6 font-space">Şirketini Geleceğe Taşı</h1>
          <p className=" text-lg text-gray-300 max-w-2xl mb-8">
            Yapay zeka, veri analitiği ve sektör trendleriyle desteklenen bir büyüme platformuna adım at.
          </p>
          <Link to="/login">
            <button
                className="bg-indigo-600 hover:bg-purple-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition duration-300">
              Hemen Başla 🚀
            </button>
          </Link>

          <motion.div
              className="mt-16"
              animate={{y: [0, 10, 0]}}
              transition={{repeat: Infinity, duration: 2}}
          >
            <FaArrowDown size={30} className="text-white"/>
          </motion.div>
        </div>

        {/* Neler Sunuyoruz */}
        <div className="text-center my-20 relative z-10">
          <motion.h2
              className="text-4xl font-bold text-gray-800 mb-4 font-space"
              initial={{opacity: 0}}
              whileInView={{opacity: 1}}
              viewport={{once: true}}
              transition={{duration: 1}}
          >
            Neler Sunuyoruz?
          </motion.h2>
          <motion.p
              className="text-gray-300 mb-12 max-w-xl mx-auto"
              initial={{opacity: 0}}
              whileInView={{opacity: 1}}
              viewport={{once: true}}
              transition={{duration: 1, delay: 0.3}}
          >
            Sana özel hazırlanmış analizler, pazar içgörüleri ve fırsatlar ile yol haritanı oluştur.
          </motion.p>

          <div
              ref={scrollRef}
              className="flex space-x-6 px-10 pb-10 overflow-hidden"
              style={{scrollbarWidth: "none"}}
          >
            {features.map((feature, index) => (
                <motion.div
                    key={index}
                    className="min-w-[280px] bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-all duration-300"
                    initial={{opacity: 0, scale: 0.8}}
                    whileInView={{opacity: 1, scale: 1}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: index * 0.2}}
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </motion.div>
            ))}
          </div>
        </div>
        {/* Kullanıcı Yorumları */}
        <div className="bg-gray-100 py-20">
          <h2 className="text-4xl font-bold text-center text-indigo-950 mb-10 font-space">Kullanıcılarımız Ne Diyor?</h2>
          <div className="flex flex-wrap justify-center gap-8 px-6">
            {testimonials.map((t, index) => (
                <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md w-80 text-center"
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: index * 0.2}}
                >
                  <p className="text-gray-600 mb-4">"{t.comment}"</p>
                  <h4 className="font-semibold text-indigo-600">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Nasıl Çalışır */}
        <div className="py-20">
          <h2 className="text-4xl font-bold text-center text-gray-300 mb-10 font-space">Nasıl Çalışır?</h2>
          <div className="flex flex-wrap justify-center gap-10 px-6">
            {steps.map((s, index) => (
                <motion.div
                    key={index}
                    className="w-64 bg-white rounded-xl shadow-lg p-6 text-center"
                    initial={{opacity: 0, x: -100}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: index * 0.2}}
                >
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{s.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </motion.div>
            ))}
          </div>
        </div>
        {/* Neden Biz */}
        <div className="py-20">
          <h2 className="text-4xl font-bold text-center text-gray-300 mb-10 font-space">Neden Biz?</h2>
          <div className="flex flex-wrap justify-center gap-10 px-6">
            {['Güncel Veriler', 'AI Destekli Öneriler', 'Kullanıcı Dostu', 'Hızlı Destek'].map((item, idx) => (
                <motion.div
                    key={idx}
                    className="w-64 bg-indigo-50 rounded-xl shadow-lg p-6 text-center"
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: idx * 0.2}}
                >
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">{item}</h3>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Platformdan Görseller */}
        <div className="bg-gray-100 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 font-space">Platformdan Görseller</h2>
          <div className="flex flex-wrap justify-center gap-8 px-6">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="w-72 h-48 bg-gray-300 rounded-lg"
                    initial={{opacity: 0, scale: 0.8}}
                    whileInView={{opacity: 1, scale: 1}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: i * 0.2}}
                />
            ))}
          </div>
        </div>

        {/* İstatistikler */}
        <div className="py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-10 font-space">Güçlü Rakamlarla</h2>
          <div className="flex justify-center gap-20">
            {[
              {number: '1200+', label: 'Analiz Üretildi'},
              {number: '800+', label: 'Şirket Kullandı'},
              {number: '20+', label: 'Teknoloji Alanı'}
            ].map((stat, idx) => (
                <motion.div
                    key={idx}
                    className="flex flex-col items-center"
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: idx * 0.3}}
                >
                  <div className="text-5xl font-bold text-indigo-600">{stat.number}</div>
                  <div className="text-gray-300 mt-2">{stat.label}</div>
                </motion.div>
            ))}
          </div>
        </div>

        {/* SSS */}
        <div className="py-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 font-space">
            Sık Sorulan Sorular
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <button
                      onClick={() => toggleFAQ(index)}
                      className="flex justify-between items-center w-full text-left text-lg font-semibold text-white hover:text-indigo-900 transition-all"
                  >
                    {faq.q}
                    <motion.span
                        initial={false}
                        animate={{rotate: openIndex === index ? 45 : 0}}
                        className="text-white"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: "auto", opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            className="overflow-hidden text-gray-300 mt-2"
                        >
                          <p>{faq.a}</p>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            ))}
          </div>
        </div>

      </section>
 </>
  );
}
