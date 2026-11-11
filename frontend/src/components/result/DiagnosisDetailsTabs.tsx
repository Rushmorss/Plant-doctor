import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { healthyCareTips } from '../../data/diseases';
import type { Disease } from '../../types/plant';

interface DiagnosisDetailsTabsProps {
  disease: Disease | null;
  tentative: boolean;
}

type TabId = 'symptoms' | 'causes' | 'care';

const tabs: {id: TabId;label: string;}[] = [
{ id: 'symptoms', label: 'Dấu hiệu' },
{ id: 'causes', label: 'Nguyên nhân' },
{ id: 'care', label: 'Chăm sóc' }];


function BulletList({ items }: {items: string[];}) {
  return (
    <ul className="space-y-3">
      {items.map((item) =>
      <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <CheckIcon className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          </span>
          {item}
        </li>
      )}
    </ul>);

}

export function DiagnosisDetailsTabs({ disease, tentative }: DiagnosisDetailsTabsProps) {
  const [active, setActive] = useState<TabId>('symptoms');

  if (!disease) {
    return (
      <section aria-labelledby="care-title" className="rounded-3xl bg-surface p-5 shadow-soft md:p-6">
        <h2 id="care-title" className="font-semibold text-ink">
          Giữ cây luôn khỏe
        </h2>
        <div className="mt-4">
          <BulletList items={healthyCareTips} />
        </div>
      </section>);

  }

  return (
    <section aria-label="Thông tin chi tiết về bệnh" className="rounded-3xl bg-surface p-5 shadow-soft md:p-6">
      {tentative &&
      <p className="mb-4 text-sm text-muted">
          Thông tin tham khảo về <span className="font-semibold text-ink">{disease.name}</span> — khả năng cao nhất,
          chưa được xác nhận.
        </p>
      }
      <div role="tablist" aria-label="Chi tiết bệnh" className="grid grid-cols-3 gap-1 rounded-xl bg-canvas p-1">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          role="tab"
          type="button"
          id={`tab-${tab.id}`}
          aria-selected={active === tab.id}
          aria-controls={`panel-${tab.id}`}
          onClick={() => setActive(tab.id)}
          className={`h-10 whitespace-nowrap rounded-lg text-sm font-semibold transition-[background-color,color,box-shadow] duration-150 ${
          active === tab.id ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-ink'}`
          }>
          
            {tab.label}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="mt-5">
          
          {active === 'symptoms' && <BulletList items={disease.symptoms} />}
          {active === 'causes' && <BulletList items={disease.causes} />}
          {active === 'care' &&
          <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Xử lý ngay</h3>
                <BulletList items={disease.care} />
              </div>
              <div className="border-t border-line pt-5">
                <h3 className="mb-3 text-sm font-semibold text-ink">Phòng ngừa lâu dài</h3>
                <BulletList items={disease.prevention} />
              </div>
            </div>
          }
        </motion.div>
      </AnimatePresence>
    </section>);

}