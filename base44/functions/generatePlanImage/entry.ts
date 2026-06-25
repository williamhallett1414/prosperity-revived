import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Generates a single reading-plan cover image via the Recraft API, uploads it
// to permanent storage, and caches the URL in the PlanImage entity so we never
// pay to generate the same plan's image twice.
//
// Payload: { plan_id, plan_name, description, force? }
// Returns: { image_url, cached: boolean }
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { plan_id, plan_name, description, subject, force } = await req.json();
    if (!plan_id) {
      return Response.json({ error: 'plan_id is required' }, { status: 400 });
    }

    // 1. Return the cached image if we already have one (unless forced).
    if (!force) {
      const existing = await base44.asServiceRole.entities.PlanImage.filter({ plan_id });
      if (existing.length > 0 && existing[0].image_url) {
        return Response.json({ image_url: existing[0].image_url, cached: true });
      }
    }

    const apiKey = Deno.env.get('Recraft_API_Key');
    if (!apiKey) {
      return Response.json({ error: 'Recraft API key is not configured' }, { status: 500 });
    }

    // 2. Build a reverent, scene-specific prompt for the plan. The scene
    //    describes what the plan is actually about so each cover is visually
    //    distinct and meaningful — not a generic Bible photo.
    const scene = (subject && subject.trim())
      ? subject.trim()
      : `the theme of "${plan_name || plan_id}" — ${description || 'Christian spiritual growth'}`;

    // Hallow-inspired prompt: muted, painterly, dignified. Hand-painted
    // devotional cover feel — closer to a museum-grade book jacket than
    // AI fantasy art. Brand-palette anchored (warm earth tones, soft gold,
    // muted teal) so generations harmonize with the rest of the app.
    //
    // Style commitments encoded here:
    //   - ONE focal subject, never busy compositions
    //   - hand-painted oil/gouache feel, visible brushwork
    //   - directional natural light, not magical glow
    //   - desaturated palette with gold accent (NOT vivid/Instagram-y)
    //   - reverent atmosphere, not whimsical or storybook
    //   - shallow depth, painterly background, subject reads instantly
    const prompt = `Hand-painted devotional illustration for a Christian reading plan cover, depicting ${scene}. One clear focal subject — landscape, architectural detail, natural element, or quiet symbolic object — rendered with visible oil-painting brushwork and painterly restraint. Dignified, contemplative atmosphere. Soft directional natural light from one side, gentle shadows, atmospheric haze. Muted earthen color palette: warm cream, deep teal, soft gold, muted ochre, hints of dusty rose — NEVER saturated, NEVER neon, NEVER magical glow. Slightly aged paper texture in the background. Composition is centered with breathing room, shallow painterly depth of field. Mood is reverent, hopeful, and human — like a museum book cover, not a stock photo, not fantasy art, not whimsical storybook. No people, no faces, no figures. No text of any kind.`;

    // 3. Generate the image with Recraft.
    const recraftRes = await fetch('https://external.api.recraft.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: 'text, words, letters, typography, captions, title, writing, inscription, calligraphy, signage, labels, watermark, logo, open book, bible pages, scroll, signpost, plaque, banner with text, neon, vibrant saturated colors, magical glow, fantasy art, anime, cartoon, whimsical, storybook illustration, photorealistic photograph, stock photo, 3D render, plastic, smooth airbrushed look, busy composition, people, faces, figures, hands, cluttered background',
        style: 'digital_illustration',
        size: '1024x1024',
        n: 1,
      }),
    });

    if (!recraftRes.ok) {
      const errText = await recraftRes.text();
      return Response.json({ error: `Recraft API error: ${errText}` }, { status: 502 });
    }

    const recraftData = await recraftRes.json();
    const generatedUrl = recraftData?.data?.[0]?.url;
    if (!generatedUrl) {
      return Response.json({ error: 'Recraft returned no image' }, { status: 502 });
    }

    // 4. Download the generated image and re-upload it to permanent app storage
    //    (Recraft URLs are temporary).
    const imgResp = await fetch(generatedUrl);
    const imgBlob = await imgResp.blob();
    const file = new File([imgBlob], `${plan_id}.png`, { type: 'image/png' });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // 5. Cache it in the PlanImage entity (update if a row exists, else create).
    const existing = await base44.asServiceRole.entities.PlanImage.filter({ plan_id });
    if (existing.length > 0) {
      await base44.asServiceRole.entities.PlanImage.update(existing[0].id, {
        image_url: file_url,
        plan_name: plan_name || existing[0].plan_name,
      });
    } else {
      await base44.asServiceRole.entities.PlanImage.create({
        plan_id,
        plan_name: plan_name || '',
        image_url: file_url,
      });
    }

    return Response.json({ image_url: file_url, cached: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});