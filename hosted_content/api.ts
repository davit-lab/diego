
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zgvdmiabgbutfcsaqysc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndmRtaWFiZ2J1dGZjc2FxeXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjAzNjEsImV4cCI6MjA4NjYzNjM2MX0.G9_dWZX6G91-nDExAS3aot1Jceio3SIYWD7XBjpUc-A';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const API = {
  async getContent(defaults: any) {
    try {
      const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
      if (error || !data) throw error;
      
      const merge = (def: any, db: any) => {
        const result = { ...def };
        for (const key in db) {
          if (db[key] && typeof db[key] === 'object' && !Array.isArray(db[key]) && def[key]) {
            result[key] = { ...def[key], ...db[key] };
          } else {
            result[key] = db[key];
          }
        }
        return result;
      };

      return {
        ka: merge(defaults.ka, data.ka_data),
        en: merge(defaults.en, data.en_data)
      };
    } catch (e) {
      return defaults;
    }
  },

  async updateContent(data: any) {
    try {
      const { error } = await supabase.from('site_content').upsert({
        id: 1,
        ka_data: data.ka,
        en_data: data.en,
        updated_at: new Date().toISOString()
      });
      if (error) console.error('Supabase updateContent error:', error);
      return { ok: !error };
    } catch (e) { 
      console.error('updateContent exception:', e);
      return { ok: false }; 
    }
  },

  async getTeam(defaults: any[]) {
    try {
      const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
      if (error) {
        console.error('Supabase getTeam error:', error);
        throw error;
      }
      if (data && data.length > 0) {
        return data.map(m => ({
          id: m.id,
          name: { ka: m.name_ka, en: m.name_en },
          role: { ka: m.role_ka, en: m.role_en },
          image: m.image_url,
          bio: { ka: m.bio_ka || '', en: m.bio_en || '' },
          education: { ka: m.education_ka || '', en: m.education_en || '' },
          specialization: { ka: m.specialization_ka || '', en: m.specialization_en || '' },
          isActive: m.is_active !== false,
          type: m.member_type || 'doctor'
        }));
      }
    } catch (e) {
      console.error('getTeam exception:', e);
    }
    return defaults;
  },

  async updateTeam(teamData: any[]) {
    try {
      // Clean up and insert updated team
      const { error: delError } = await supabase.from('team_members').delete().neq('name_ka', '_TEMP_');
      if (delError) console.error('Supabase updateTeam delete error:', delError);
      
      const toInsert = teamData.map(m => ({
        name_ka: m.name.ka,
        name_en: m.name.en,
        role_ka: m.role.ka,
        role_en: m.role.en,
        image_url: m.image,
        bio_ka: m.bio?.ka || '',
        bio_en: m.bio?.en || '',
        education_ka: m.education?.ka || '',
        education_en: m.education?.en || '',
        specialization_ka: m.specialization?.ka || '',
        specialization_en: m.specialization?.en || '',
        is_active: m.isActive !== false,
        member_type: m.type || 'doctor'
      }));
      const { error } = await supabase.from('team_members').insert(toInsert);
      if (error) console.error('Supabase updateTeam insert error:', error);
      return { ok: !error };
    } catch (e) { 
      console.error('updateTeam exception:', e);
      return { ok: false }; 
    }
  },

  async getBlogPosts() {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase getBlogPosts error:', error);
        throw error;
      }
      return data.map(p => ({
        id: p.slug,
        title: { ka: p.title_ka, en: p.title_en },
        content: { ka: p.content_ka, en: p.content_en },
        category: { ka: p.category_ka, en: p.category_en },
        excerpt: { ka: p.excerpt_ka, en: p.excerpt_en },
        image: p.image_url,
        date: p.post_date
      }));
    } catch (e) { 
      console.error('getBlogPosts exception:', e);
      return []; 
    }
  },

  async updateBlogPosts(posts: any[]) {
    try {
      const { error: delError } = await supabase.from('blog_posts').delete().neq('slug', '_TEMP_');
      if (delError) console.error('Supabase updateBlogPosts delete error:', delError);
      
      const toInsert = posts.map(p => ({
        slug: p.id,
        title_ka: p.title.ka,
        title_en: p.title.en,
        content_ka: p.content.ka,
        content_en: p.content.en,
        category_ka: p.category.ka,
        category_en: p.category.en,
        excerpt_ka: p.excerpt.ka,
        excerpt_en: p.excerpt.en,
        image_url: p.image,
        post_date: p.date
      }));
      const { error } = await supabase.from('blog_posts').insert(toInsert);
      if (error) console.error('Supabase updateBlogPosts insert error:', error);
      return { ok: !error };
    } catch (e) { 
      console.error('updateBlogPosts exception:', e);
      return { ok: false }; 
    }
  },

  async getLeads() {
    try {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      return data || [];
    } catch (e) { return []; }
  },

  async createLead(lead: any) {
    try {
      const { error } = await supabase.from('leads').insert([{
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        doctor: lead.doctor,
        concern: lead.concern,
        message: lead.message,
        date: lead.date
      }]);
      return { ok: !error };
    } catch (e) { return { ok: false }; }
  },

  async deleteLead(id: any) {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    return { ok: !error };
  },

  async getStorageStats() {
    try {
      const [leads, team, blog, content] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('site_content').select('*', { count: 'exact', head: true })
      ]);

      return {
        leads: leads.count || 0,
        team: team.count || 0,
        blog: blog.count || 0,
        content: content.count || 0,
        totalRows: (leads.count || 0) + (team.count || 0) + (blog.count || 0) + (content.count || 0)
      };
    } catch (e) {
      console.error('getStorageStats error:', e);
      return null;
    }
  }
};
