import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { reference, book, chapter } = await req.json();
    
    // Build reference from book and chapter if provided separately
    const bibleRef = reference || (book && chapter ? `${book} ${chapter}` : null);
    
    if (!bibleRef) {
      return Response.json({ error: 'Reference or book/chapter is required' }, { status: 400 });
    }
    
    // Fetch from Bible API
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(bibleRef)}?translation=kjv`);
    
    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch verse' }, { status: 500 });
    }
    
    const data = await response.json();
    
    return Response.json({
      reference: data.reference,
      verses: data.verses,
      text: data.text,
      translation: data.translation_name
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});