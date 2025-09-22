import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { clanId, clanName, traits, characteristics, color } = await request.json();

    if (!clanId || !clanName) {
      return NextResponse.json({ error: 'Clan ID and name are required' }, { status: 400 });
    }

    // Create a detailed prompt based on clan attributes
    const iconPrompt = createIconPrompt(clanName, traits, characteristics, color);
    console.log('\n========== SENDING TO GOOGLE GEMINI ==========');
    console.log('CLAN:', clanName);
    console.log('COLOR:', color);
    console.log('FULL PROMPT:', iconPrompt);
    console.log('==============================================\n');

    // Skip Gemini API and use our hand-crafted icons
    const useCustomIcons = true; // Set to false to use Gemini API

    if (useCustomIcons) {
      // Use our custom designed SVG icons
      const customSvg = generateFallbackSvg(clanName, color, traits);
      return NextResponse.json({
        success: true,
        svgData: customSvg,
        prompt: iconPrompt,
        timestamp: Date.now(),
        custom: true
      });
    }

    // Call Google Gemini API for icon generation (currently disabled)
    const apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const apiKey = process.env.GEMINI_API_KEY;

    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${iconPrompt}

IMPORTANT COLOR PALETTE for ${clanName}:
- Primary color: ${color}
- Secondary: A lighter tint of ${color}
- Border: A darker shade of ${color}

OUTPUT REQUIREMENTS:
- Return ONLY valid SVG code
- No explanations, comments, or markdown
- Start with <svg and end with </svg>
- Must be a complete, working SVG

Example structure:
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="120" fill="${color}" stroke="darker-shade" stroke-width="2"/>
  <path d="..." fill="white"/>
</svg>`
            }]
          }],
          generationConfig: {
            temperature: 0.4,  // Lower temperature for more consistent results
            topK: 20,          // More focused selection
            topP: 0.8,         // More deterministic
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract SVG from Gemini response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Try to extract SVG code from the response
      let svgData = generatedText;
      const svgMatch = generatedText.match(/<svg[^>]*>.*?<\/svg>/s);
      if (svgMatch) {
        svgData = svgMatch[0];
      }

      // Validate it's actually SVG
      if (!svgData.includes('<svg')) {
        throw new Error('No valid SVG in response');
      }

      return NextResponse.json({
        success: true,
        svgData: svgData,
        prompt: iconPrompt,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Gemini API error:', error);

      // Always use our custom designed fallback icons
      const fallbackSvg = generateFallbackSvg(clanName, color, traits);

      return NextResponse.json({
        success: true,
        fallback: true,
        svgData: fallbackSvg,
        error: 'Using fallback icon'
      });
    }

  } catch (error) {
    console.error('Error in clan icon generation API:', error);
    return NextResponse.json({ error: 'Failed to generate clan icon' }, { status: 500 });
  }
}

function createIconPrompt(clanName: string, traits: string[], characteristics: string[], color: string): string {
  const clanDesigns: { [key: string]: { symbol: string, description: string } } = {
    'ThunderClan': {
      symbol: 'lightning bolt striking through an oak tree',
      description: 'Create a strong oak tree with a dramatic lightning bolt cutting through it. The oak represents their forest territory, and lightning represents Thunder (their founder). Include oak leaves. The design should convey courage, strength, and their connection to the deciduous forest.'
    },
    'RiverClan': {
      symbol: 'fish leaping above willow branches and river waves',
      description: 'Design a sleek fish (like a river trout) jumping above flowing water waves, with drooping willow branch elements framing the scene. Include small river stones or shells at the bottom. This represents their love of water, fishing skills, and their island camp surrounded by willows.'
    },
    'WindClan': {
      symbol: 'running rabbit silhouette with heather and stars',
      description: 'Show a leaping rabbit (their main prey) in profile with sprigs of heather beneath it and small stars above, representing their belief they are closest to StarClan. Add subtle wind swirls. This captures their moorland home, speed, and spiritual connection.'
    },
    'ShadowClan': {
      symbol: 'pine tree silhouette with crescent moon and marsh reeds',
      description: 'Create a dark pine tree (their territory marker) with a crescent moon visible through the branches, and marsh reeds at the base. Add subtle shadow patterns. This represents their pine forest territory, night hunting skills, and marshy homeland.'
    },
    'SkyClan': {
      symbol: 'cat climbing a tree trunk with extended claws',
      description: 'Design a cat silhouette climbing vertically up a tree trunk, with visible claw marks in the bark. Show strong branches spreading outward. This represents their unique climbing abilities and their return to the forest after exile.'
    },
    'Tribe of Rushing Water': {
      symbol: 'mountain peak with waterfall cascading into a cave',
      description: 'Create a triangular mountain with a prominent waterfall flowing down into a cave entrance at the base. Add some rocky outcroppings and mist effects. This represents their mountain home, the Cave of Rushing Water, and their ancient traditions.'
    }
  };

  const clan = clanDesigns[clanName] || {
    symbol: 'a stylized cat face',
    description: 'Create a simple, geometric cat face with pointed ears'
  };

  // Authentic Warriors-inspired prompt
  const prompt = `Create a Warriors Cats clan badge based on the official book series lore.

DESIGN REQUIREMENTS:
You must create a circular badge with this exact structure:
1. Outer circle: ${color} background
2. Dark border ring: 20% darker than ${color}
3. Inner white circle for the symbol
4. The clan symbol in ${color} on the white background

${clanName.toUpperCase()} AUTHENTIC DETAILS:
${clan.description}

CRITICAL SYMBOL ELEMENTS: ${clan.symbol}

STYLE GUIDELINES:
- This is based on the Warriors book series by Erin Hunter
- The design should look like an official clan emblem that warriors would wear
- Keep it simple but meaningful - each element should represent the clan's identity
- Use clean, bold shapes that work as a badge or patch
- The symbol must be immediately recognizable as representing ${clanName}
- Think of it as a military unit patch or sports team crest

TECHNICAL SPECS:
- SVG format with viewBox="0 0 256 256"
- Outer circle radius: 118px centered at (128, 128)
- Border: 6px stroke
- Inner white circle radius: 100px
- Symbol should use 70% of the white circle space
- Use paths with stroke-width of at least 3px for visibility

Remember: This represents the ${traits.join(', ')} warriors of ${clanName}.`;

  return prompt;
}

function generateFallbackSvg(clanName: string, color: string, traits: string[]): string {
  // Generate darker color for border (20% darker)
  const darkerColor = color.replace('#', '');
  const r = parseInt(darkerColor.substr(0, 2), 16);
  const g = parseInt(darkerColor.substr(2, 2), 16);
  const b = parseInt(darkerColor.substr(4, 2), 16);
  const darker = `#${Math.round(r * 0.8).toString(16).padStart(2, '0')}${Math.round(g * 0.8).toString(16).padStart(2, '0')}${Math.round(b * 0.8).toString(16).padStart(2, '0')}`;

  // Minimalist geometric icons inspired by official Warriors merchandise
  const symbols: { [key: string]: string } = {
    'ThunderClan': `
      <!-- Cat silhouette -->
      <path d="M 128 95 Q 100 95, 95 115 Q 95 130, 110 140 L 110 160 L 120 160 L 120 145 L 136 145 L 136 160 L 146 160 L 146 140 Q 161 130, 161 115 Q 156 95, 128 95 Z"
            fill="${color}"/>
      <!-- Cat ears -->
      <path d="M 105 95 L 100 75 L 115 85 Z" fill="${color}"/>
      <path d="M 151 95 L 156 75 L 141 85 Z" fill="${color}"/>
      <!-- Lightning bolt in center -->
      <path d="M 128 105 L 120 120 L 128 120 L 124 130 L 136 115 L 128 115 L 132 105 Z"
            fill="white"/>
      <!-- Angry eyes -->
      <path d="M 115 108 L 120 110" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <path d="M 141 108 L 136 110" stroke="white" stroke-width="3" stroke-linecap="round"/>
    `,
    'RiverClan': `
      <!-- Cat silhouette -->
      <path d="M 128 95 Q 100 95, 95 115 Q 95 130, 110 140 L 110 160 L 120 160 L 120 145 L 136 145 L 136 160 L 146 160 L 146 140 Q 161 130, 161 115 Q 156 95, 128 95 Z"
            fill="${color}"/>
      <!-- Cat ears -->
      <path d="M 105 95 L 100 75 L 115 85 Z" fill="${color}"/>
      <path d="M 151 95 L 156 75 L 141 85 Z" fill="${color}"/>
      <!-- Wave pattern -->
      <path d="M 110 120 Q 118 115, 128 120 Q 138 115, 146 120" stroke="white" stroke-width="3" fill="none"/>
      <path d="M 110 128 Q 118 123, 128 128 Q 138 123, 146 128" stroke="white" stroke-width="3" fill="none"/>
      <!-- Peaceful eyes -->
      <circle cx="118" cy="110" r="2" fill="white"/>
      <circle cx="138" cy="110" r="2" fill="white"/>
    `,
    'WindClan': `
      <!-- Cat silhouette -->
      <path d="M 128 95 Q 100 95, 95 115 Q 95 130, 110 140 L 110 160 L 120 160 L 120 145 L 136 145 L 136 160 L 146 160 L 146 140 Q 161 130, 161 115 Q 156 95, 128 95 Z"
            fill="${color}"/>
      <!-- Cat ears -->
      <path d="M 105 95 L 100 75 L 115 85 Z" fill="${color}"/>
      <path d="M 151 95 L 156 75 L 141 85 Z" fill="${color}"/>
      <!-- Wind swirls -->
      <path d="M 108 115 Q 118 113, 128 115" stroke="white" stroke-width="2" fill="none"/>
      <path d="M 108 122 Q 118 120, 128 122" stroke="white" stroke-width="2" fill="none"/>
      <path d="M 128 115 Q 138 113, 148 115" stroke="white" stroke-width="2" fill="none"/>
      <path d="M 128 122 Q 138 120, 148 122" stroke="white" stroke-width="2" fill="none"/>
      <!-- Alert eyes -->
      <circle cx="118" cy="108" r="3" fill="white"/>
      <circle cx="138" cy="108" r="3" fill="white"/>
    `,
    'ShadowClan': `
      <!-- Cat silhouette -->
      <path d="M 128 95 Q 100 95, 95 115 Q 95 130, 110 140 L 110 160 L 120 160 L 120 145 L 136 145 L 136 160 L 146 160 L 146 140 Q 161 130, 161 115 Q 156 95, 128 95 Z"
            fill="${color}"/>
      <!-- Cat ears -->
      <path d="M 105 95 L 100 75 L 115 85 Z" fill="${color}"/>
      <path d="M 151 95 L 156 75 L 141 85 Z" fill="${color}"/>
      <!-- Star/mystery symbol -->
      <path d="M 128 115 L 131 124 L 140 124 L 133 129 L 136 138 L 128 133 L 120 138 L 123 129 L 116 124 L 125 124 Z"
            fill="white"/>
      <!-- Mysterious eyes - half closed -->
      <rect x="113" y="108" width="10" height="2" fill="white"/>
      <rect x="133" y="108" width="10" height="2" fill="white"/>
    `,
    'SkyClan': `
      <!-- Cat silhouette -->
      <path d="M 128 95 Q 100 95, 95 115 Q 95 130, 110 140 L 110 160 L 120 160 L 120 145 L 136 145 L 136 160 L 146 160 L 146 140 Q 161 130, 161 115 Q 156 95, 128 95 Z"
            fill="${color}"/>
      <!-- Cat ears -->
      <path d="M 105 95 L 100 75 L 115 85 Z" fill="${color}"/>
      <path d="M 151 95 L 156 75 L 141 85 Z" fill="${color}"/>
      <!-- Tree/branch pattern -->
      <rect x="126" y="115" width="4" height="20" fill="white"/>
      <path d="M 128 115 L 118 108 M 128 120 L 138 113 M 128 125 L 118 118"
            stroke="white" stroke-width="3" stroke-linecap="round"/>
      <!-- Determined eyes -->
      <path d="M 113 108 L 123 108" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <path d="M 143 108 L 133 108" stroke="white" stroke-width="3" stroke-linecap="round"/>
    `,
    'Tribe of Rushing Water': `
      <!-- Cat silhouette -->
      <path d="M 128 95 Q 100 95, 95 115 Q 95 130, 110 140 L 110 160 L 120 160 L 120 145 L 136 145 L 136 160 L 146 160 L 146 140 Q 161 130, 161 115 Q 156 95, 128 95 Z"
            fill="${color}"/>
      <!-- Cat ears -->
      <path d="M 105 95 L 100 75 L 115 85 Z" fill="${color}"/>
      <path d="M 151 95 L 156 75 L 141 85 Z" fill="${color}"/>
      <!-- Mountain peak -->
      <path d="M 128 108 L 118 125 L 138 125 Z" fill="white"/>
      <path d="M 128 108 L 123 117 L 133 117 Z" fill="${color}"/>
      <!-- Waterfall lines -->
      <rect x="127" y="125" width="2" height="10" fill="white"/>
      <!-- Wise eyes -->
      <circle cx="118" cy="108" r="2" fill="white"/>
      <circle cx="138" cy="108" r="2" fill="white"/>
    `
  };

  const symbol = symbols[clanName] || symbols['ThunderClan'];

  return `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer circle background -->
  <circle cx="128" cy="128" r="120" fill="${color}" />
  <!-- Dark border ring -->
  <circle cx="128" cy="128" r="120" fill="none" stroke="${darker}" stroke-width="4" />
  <!-- White inner circle for symbol background -->
  <circle cx="128" cy="128" r="100" fill="white" />
  <!-- Clan symbol in center -->
  ${symbol}
</svg>`;
}