import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon } from 'lucide-react';

interface ResultHeroProps {
  image: string;
  cropName: string;
  location: string;
}

export function ResultHero({ image, cropName, location }: ResultHeroProps) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);else
    navigate('/app/history');
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink md:rounded-3xl lg:aspect-[4/5]">
      <img src={image} alt={`Ảnh ${cropName} được phân tích`} className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={goBack}
        aria-label="Quay lại"
        className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors duration-150 hover:bg-black/60">
        
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <span className="absolute bottom-10 left-4 right-4 inline-flex w-fit max-w-[calc(100%-2rem)] items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur md:bottom-4">
        <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{location}</span>
      </span>
    </div>);

}