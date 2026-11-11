import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ShieldCheckIcon } from 'lucide-react';
import { buttonClasses } from '../ui/buttonStyles';
import { images } from '../../data/images';

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-10 md:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:pb-28 lg:pt-16">
      <div className="min-w-0">
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-tight text-ink min-[375px]:text-[34px] sm:text-5xl lg:text-[54px]">
          Chụp một tấm ảnh lá,
          <span className="block text-primary">biết ngay cây đang bệnh gì.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
          AI Plant Doctor dùng thị giác máy tính để nhận diện bệnh trên các cây trồng chủ lực tại Việt Nam,
          kèm hướng dẫn chăm sóc dễ hiểu — ngay trên chiếc điện thoại của bạn.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/register" className={buttonClasses('primary', 'lg')}>
            Bắt đầu miễn phí
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link to="/login" className={buttonClasses('outline', 'lg')}>
            Tôi đã có tài khoản
          </Link>
        </div>
        <p className="mt-6 flex items-start gap-2 text-sm text-muted">
          <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          Được hơn 12.000 nhà nông, sinh viên và kỹ sư tin dùng
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="aspect-[4/5] overflow-hidden rounded-[28px] shadow-lift">
          <img
            src={images.hero}
            alt="Nông dân dùng điện thoại chụp lá cà chua có dấu hiệu bệnh"
            className="h-full w-full object-cover" />
          
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="absolute -bottom-8 left-4 right-4 rounded-2xl bg-surface p-4 shadow-lift sm:left-auto sm:right-6 sm:w-80 lg:-left-10 lg:right-auto">
          
          <div className="flex items-center gap-3">
            <img src={images.tomatoBlight} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Cà chua · vừa phân tích</p>
              <p className="truncate font-semibold text-ink">Bệnh mốc sương</p>
            </div>
            <span className="text-lg font-bold text-primary">94%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full w-[94%] rounded-full bg-primary" />
          </div>
        </motion.div>
      </div>
    </section>);

}