// Model definitions for different hole configurations

export const xiaoModels = {
  // 8 holes models
  pentatonic_8: {
    name: "Xiao Pentatonique Majeure Traditionnelle",
    holes: 8,
    descriptionKey: "model_pentatonic_8_desc",
    intervals: [0, 2, 4, 7, 9, 12, 14, 16]
  },
  heptatonic_8: {
    name: "Xiao Heptatonique Traditionnelle",
    holes: 8,
    descriptionKey: "model_heptatonic_8_desc",
    intervals: [0, 2, 4, 5, 7, 9, 10, 12]
  },
  diatonic_8: {
    name: "Xiao Diatonique Moderne",
    holes: 8,
    descriptionKey: "model_diatonic_8_desc",
    intervals: [0, 2, 4, 5, 7, 9, 11, 12]
  },
  // 7 holes models
  pentatonic_7a: {
    name: "Xiao 7 trous - Pentatonique + 4e diatonique",
    holes: 7,
    descriptionKey: "model_pentatonic_7a_desc",
    intervals: [0, 2, 4, 7, 8, 10, 13]
  },
  pentatonic_7b: {
    name: "Xiao 7 trous - Pentatonique + 7e mineure",
    holes: 7,
    descriptionKey: "model_pentatonic_7b_desc",
    intervals: [0, 2, 4, 7, 9, 10, 13]
  },
  // 6 holes model
  pentatonic_6: {
    name: "Xiao 6 trous - Pentatonique traditionnelle",
    holes: 6,
    descriptionKey: "model_pentatonic_6_desc",
    intervals: [0, 2, 4, 7, 9, 12]
  },
  // 5 holes model
  pentatonic_5: {
    name: "Xiao 5 trous - Pentatonique pur",
    holes: 5,
    descriptionKey: "model_pentatonic_5_desc",
    intervals: [0, 2, 4, 7, 9]
  },
  // 4 holes model
  pentatonic_4: {
    name: "Xiao 4 trous - Ultra minimaliste",
    holes: 4,
    descriptionKey: "model_pentatonic_4_desc",
    intervals: [0, 2, 5, 7]
  }
};

// Get models by hole count
export function getModelsByHoles(numHoles) {
  return Object.entries(xiaoModels)
    .filter(([, model]) => model.holes === numHoles)
    .map(([key, model]) => ({ key, ...model }));
}

// Model descriptions (HTML content)
export const modelDescriptions = {
  pentatonic_8: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 SCÉNARIO 1 — La xiao pentatonique majeure traditionnelle (la plus courante)</h3>
    <p><strong>Gamme :</strong> Gong – Shang – Jue – Zhi – Yu</p>
    <p>Pentatonique majeure chinoise → équivalent de la pentatonique majeure occidentale.</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 8 notes (avec intervalles) :</h4>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>M2 (4)</li>
      <li>m3 (7)</li>
      <li>M2 (9)</li>
      <li>m3 (12)</li>
      <li>M2 (14) ← facultatif selon les modèles</li>
      <li>M2 (16)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 – +3 – +2 – +2</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">C'est la structure 90% des xiao du commerce. Elle donne une mélodie "flottante", typique de la musique chinoise.</p>
  `,
  heptatonic_8: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 SCÉNARIO 2 — Xiao heptatonique traditionnelle (moins courante)</h3>
    <p>Dans certaines musiques rituelles ou locales, la xiao est accordée avec une gamme heptatonique ancienne, proche du mode mixolydien ou dorien selon la région.</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 8 notes (avec intervalles) :</h4>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>M2 (4)</li>
      <li>m2 (5)</li>
      <li>M2 (7)</li>
      <li>M2 (9)</li>
      <li>m2 (10)</li>
      <li>M2 (12)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +1 – +2 – +2 – +1 – +2</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">On est proche d'une gamme majeure mais avec une 4e augmentée et une 7e mineure. C'est rare mais historiquement authentique.</p>
  `,
  diatonic_8: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 SCÉNARIO 3 — Xiao diatonique moderne (occidentalisée)</h3>
    <p>Utilisée par certains musiciens contemporains pour jouer des mélodies occidentales. Ici on force une gamme majeure complète.</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 8 notes (avec intervalles) :</h4>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>M2 (4)</li>
      <li>m2 (5)</li>
      <li>M2 (7)</li>
      <li>M2 (9)</li>
      <li>M2 (11)</li>
      <li>m2 (12)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +1 – +2 – +2 – +2 – +1</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">C'est jouable, mais ergonomiquement difficile. Les trous se superposent souvent.</p>
  `,
  pentatonic_7a: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟩 Xiao à 7 trous - Variante A (pentatonique + 4e diatonique)</h3>
    <p>Le 7e trou apporte une note de passage supplémentaire, enrichissant la gamme pentatonique traditionnelle.</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 7 notes (avec intervalles) :</h4>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>M2 (4)</li>
      <li>m3 (7)</li>
      <li>m2 (8)</li>
      <li>M2 (10)</li>
      <li>m3 (13)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +1 – +2 – +3</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">Assez peu courant, mais attesté dans certains styles anciens.</p>
  `,
  pentatonic_7b: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟩 Xiao à 7 trous - Variante B (pentatonique + 7e mineure)</h3>
    <p>Cette variante ajoute une 7e mineure à la gamme pentatonique, offrant un doigté alternatif pour stabiliser certains micro-intervalles.</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 7 notes (avec intervalles) :</h4>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>M2 (4)</li>
      <li>m3 (7)</li>
      <li>M2 (9)</li>
      <li>m2 (10)</li>
      <li>m3 (13)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 – +1 – +3</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">Rare mais attesté dans certains styles anciens et musiques traditionnelles locales.</p>
  `,
  pentatonic_6: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 Xiao à 6 trous (le plus traditionnel)</h3>
    <p>Pendant la plus grande partie de l'histoire, la xiao n'avait que 6 trous.</p>
    <p><strong>✔ Typiquement associés à la gamme pentatonique :</strong></p>
    <p>Gong – Shang – Jue – Zhi – Yu → donc : M2 – M2 – m3 – M2 – m3</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 6 trous = 5 intervalles + octave</h4>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>M2 (4)</li>
      <li>m3 (7)</li>
      <li>M2 (9)</li>
      <li>m3 (12)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 – +3</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">C'est le modèle le plus ancien, le plus ergonomique, celui des xiao du Sud (nanxiao), celui utilisé dans beaucoup de musiques traditionnelles. C'est le scénario le plus courant pour "moins de 8 trous".</p>
  `,
  pentatonic_5: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟥 Xiao à 5 trous (super traditionnel, le vrai pentatonique brut)</h3>
    <p>C'est une xiao primordiale, très épurée. Chaque trou correspond à une note de la pentatonique complète, sans "notes de passage".</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Structure exacte :</h4>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>M2 (4)</li>
      <li>m3 (7)</li>
      <li>M2 (9)</li>
      <li>(+3 pour octave = 12)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 (+ octave)</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">On a vraiment que la pentatonique, rien d'autre. C'est courant dans certaines régions du Sichuan, dans les instruments de cérémonie, dans les flûtes anciennes en bambou massif. Très authentique, plus simple et très ergonomique. Beaucoup plus facile à fabriquer : les trous sont bien espacés.</p>
  `,
  pentatonic_4: `
    <h3 style="color: #6d5738; margin-bottom: 15px;">🟧 Xiao à 4 trous (ultra minimaliste)</h3>
    <p>Rare mais attestée dans certaines traditions chamaniques, des flûtes de méditation ou funéraires, des instruments folkloriques dépouillés.</p>
    <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Structure :</h4>
    <p>C'est une pentatonique réduite, souvent :</p>
    <ul style="line-height: 1.8;">
      <li>Tonique (0)</li>
      <li>M2 (2)</li>
      <li>m3 (5)</li>
      <li>M2 (7)</li>
      <li>(+3 pour octave si besoin)</li>
    </ul>
    <p><strong>✔ Résumé des intervalles :</strong> +2 – +3 – +2</p>
    <p style="margin-top: 10px; font-style: italic; color: #6d5738;">On retire deux degrés de la pentatonique. Ce sont des flûtes "à rôle", pas mélodiques au sens occidental.</p>
  `
};
