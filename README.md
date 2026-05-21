# 🎮 SayıDışı - Missing Digit Game

**9 haneli bir sayıdan eksik olan rakamı bul!** | **Find the missing digit from a 9-digit number!**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-green.svg)](https://aardaakpinar.github.io/sayidisi/)

## 📋 Hakkında

**SayıDışı**, hızı ve konsantrasyonu test eden eğlenceli bir web oyunudur. 9 haneli rastgele bir sayıda olmayan tek rakamı bulmalısın ve belirtilen süre içinde doğru cevabı vermek zorundasın.

### Özellikler

- ✅ **Konsol Desteği**: Numpad ve fiziksel klavye ile oynanabilir
- ✅ **Zorluk Seviyeleri**: Zorluk arttıkça puan çarpanı da artar
- ✅ **İlerleme Göstergesi**: Geriye kalan süreyi görsel olarak takip et
- ✅ **Skor Sistemi**: Başarılı cevapların ardı ardına verilmesi bonus puanı arttırır
- ✅ **Responsive Design**: Masaüstü, tablet ve mobil cihazlarda mükemmel çalışır
- ✅ **PWA Desteği**: Progressive Web App olarak yüklenebilir ve çevrimdışında çalışabilir
- ✅ **Türkçe**: Tam türkçe arayüz ve oyun mekaniği

## 🎯 Nasıl Oynanır?

1. **Oyun Başlarsa** ekranda 9 haneli rastgele bir sayı görüntülenir
2. **Amaç**: Bu sayıda **olmayan** rakamı bulup geri bildirim vermek
3. **Giriş**: 
   - Klavyeden (0-9 tuşları)
   - Numpad'dan
   - Mobil cihazda sanal tuş takımından
4. **Zaman**: Her sorunun cevabı için belirli bir süreniz vardır
5. **Skor**: 
   - Doğru cevap = Puan kazanırsın
   - Ardı ardına doğru cevaplar = Bonus çarpanı artar
   - Zorluk seviyesi yükseldikçe = Daha fazla puan

## 🛠️ Teknoloji Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Framework**: PWA (Progressive Web App)
- **Runtime**: Browser-based

## 🚀 Kurulum ve Çalıştırma

### Çevrimiçi Oynama
Doğrudan tarayıcıda oynanabilir:
```
https://aardaakpinar.github.io/sayidisi/
```

### Yerel Makinede Çalıştırma
```bash
# Repoyu klonla
git clone https://github.com/aardaakpinar/sayidisi.git

# Dizine geç
cd sayidisi

# Basit bir web sunucusu başlat (Python)
python -m http.server 8000

# Tarayıcıda aç
# http://localhost:8000
```

## 🎮 Skor Sistemi

| Aktivite | Puan |
|----------|------|
| Doğru Cevap | 10 × Zorluk × Çarpan |
| Ardı Ardına Doğru | Çarpan +1 |
| Hata | Çarpan Sıfırlanır |

## 🔒 Lisans

Bu proje **GNU General Public License v3.0** altında lisanslanmıştır.  
Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- Tailwind CSS ekibine muazzam CSS çerçevesi için
- Tüm oyunculara geri bildirim ve destek için

---

**Keyifli oyunlar! 🎮✨**
