import React from 'react';
import { secondaryFeatures } from '../../data/landingContent';

const confidenceExamples = [
{ label: 'Bệnh mốc sương', value: 94, bar: 'bg-primary', note: 'Kết luận rõ ràng' },
{ label: 'Đốm lá Sigatoka đen', value: 76, bar: 'bg-warning', note: 'Nên đối chiếu thêm' },
{ label: 'Có thể: Đốm lá lớn', value: 58, bar: 'bg-danger', note: 'Chưa kết luận, gợi ý chuyên gia' }];


export function FeatureSection() {
  return (
    <section id="tinh-nang" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8 lg:py-24">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Một bác sĩ cây trồng trung thực, luôn ở bên bạn
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        <article className="min-w-0 rounded-3xl bg-ink p-5 text-white sm:p-6 md:p-8">
          <h3 className="text-xl font-semibold md:text-2xl">Không đoán bừa khi chưa chắc chắn</h3>
          <p className="mt-3 max-w-md leading-relaxed text-white/75">
            Mỗi kết quả đi kèm độ tin cậy. Khi AI chưa đủ cơ sở, ứng dụng nói rõ điều đó, đưa ra các khả năng
            và khuyên bạn hỏi chuyên gia — thay vì đưa ra một chẩn đoán sai.
          </p>
          <ul className="mt-8 space-y-5">
            {confidenceExamples.map((item) =>
            <li key={item.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold tabular-nums">{item.value}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${item.bar}`} style={{ width: `${item.value}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-white/60">{item.note}</p>
              </li>
            )}
          </ul>
        </article>

        <ul className="min-w-0 divide-y divide-line">
          {secondaryFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="flex gap-4 py-6 first:pt-0 last:pb-0 lg:first:pt-2">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink/70">{feature.description}</p>
                </div>
              </li>);

          })}
        </ul>
      </div>
    </section>);

}