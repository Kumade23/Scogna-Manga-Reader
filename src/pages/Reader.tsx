import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaInfo, type MangaInfo, type Chapter, getPageImageUrl } from '../api';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './Reader.css';

const Reader = () => {
  const { linkId, slug, chapterId } = useParams();
  const navigate = useNavigate();
  const { saveHistory, getHistory } = useStore();
  
  const isTouch = typeof window !== 'undefined' ? window.matchMedia("(hover: none) and (pointer: coarse)").matches : true;
  
  const [info, setInfo] = useState<MangaInfo | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showUI, setShowUI] = useState(true);
  
  const hasScrolledRef = useRef(false);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    if (!linkId || !slug) return;
    getMangaInfo(linkId, slug).then(data => {
      setInfo(data);
      let ch: Chapter | undefined;
      for (const { chapters } of data.pages.volumes || []) {
        ch = chapters.find(c => c._id === chapterId || c.id === chapterId);
        if (ch) break;
      }
      if (!ch && data.pages.singleChapters) {
        ch = data.pages.singleChapters.find(c => c._id === chapterId || c.id === chapterId);
      }
      if (ch) {
        setCurrentChapter(ch);
        const h = getHistory(data.manga.id);
        if (h && (h.chapterId === ch._id || h.chapterId === ch.id)) {
          setCurrentPage(h.page);
        } else {
          setCurrentPage(0);
        }
        hasScrolledRef.current = false; // reset for new chapter
      }
    });
  }, [linkId, slug, chapterId]);

  useEffect(() => {
    if (info && currentChapter) {
      saveHistory({
        mangaId: info.manga.id,
        linkId: info.manga.linkId,
        slugFolder: info.manga.slugFolder,
        title: info.manga.title,
        image: info.manga.image,
        chapterId: currentChapter._id || currentChapter.id || '',
        chapterName: currentChapter.name,
        page: currentPage
      });
    }
  }, [info, currentChapter, currentPage, saveHistory]);

  // Scroll Spy for Page Number and Auto-Scroll to saved page
  useEffect(() => {
    if (!currentChapter) return;
    
    // Auto-scroll to saved page once images are mounted
    if (!hasScrolledRef.current && currentPage > 0) {
      const img = document.querySelector(`img[data-index="${currentPage}"]`) as HTMLElement;
      if (img) {
        if (isTouch && transformRef.current) {
          transformRef.current.setTransform(0, -img.offsetTop, 1, 0);
        } else {
          img.scrollIntoView({ block: 'start' });
        }
        hasScrolledRef.current = true;
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          setCurrentPage(index);
        }
      });
    }, {
      root: null,
      rootMargin: "-50% 0px -50% 0px" // Only trigger when image hits the exact center of screen
    });
    
    const elements = document.querySelectorAll('.page-image-scroll');
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [currentChapter, showUI]);

  if (!info || !currentChapter) return <div className="reader-loading">Loading Reader...</div>;

  return (
    <div className={`reader-wrapper ${showUI ? 'ui-visible' : 'ui-hidden'}`}>
      {/* Top Bar */}
      <div className="reader-topbar glass-panel" onClick={e => e.stopPropagation()}>
        <button className="icon-btn" onClick={() => {
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate(`/series/${linkId}/${slug}`);
          }
        }}>
          <X size={24} />
        </button>
        <div className="reader-title">
          <h3>{info.manga.title}</h3>
          <span>{currentChapter.name}</span>
        </div>
        <div style={{ width: '40px' }}></div> {/* Spacer for balance */}
      </div>

      {/* Render Area (Vertical Scroll Strip with Zoom) */}
      <div className="reader-content" onClick={() => setShowUI(p => !p)}>
        <TransformWrapper
          ref={transformRef}
          key={currentChapter._id || currentChapter.id}
          initialScale={1}
          minScale={1}
          maxScale={4}
          centerOnInit={false}
          wheel={{ step: 0.1, activationKeys: ["Control", "Meta"] }}
          doubleClick={{ disabled: true }} 
          panning={{ disabled: false }}
        >
          <TransformComponent 
            wrapperStyle={{ width: "100%", height: "100%", overflowY: isTouch ? "hidden" : "auto", overflowX: "hidden", touchAction: "none" }} 
            contentStyle={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {currentChapter.pages.map((p, i) => (
              <img 
                key={i}
                data-index={i}
                src={getPageImageUrl(info.manga, currentChapter, p)} 
                alt={`Page ${i + 1}`} 
                className="page-image-scroll"
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            ))}
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Bottom Bar (Page Number Only) */}
      <div className="reader-bottombar glass-panel page-indicator-only" onClick={e => e.stopPropagation()}>
        <span className="page-indicator">{currentPage + 1} / {currentChapter.pages.length}</span>
      </div>
    </div>
  );
};

export default Reader;
