// app/api/settings/[schoolId]/route.js (for App Router)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Or 'supabase-js' directly if not using auth-helpers
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { schoolId } = params; // Get schoolId from params

  // ... (rest of the authorization and logic is similar)
  // Adapt req.query to params, and res.json to NextResponse.json

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ error: sessionError ? sessionError.message : 'Not authenticated.' }, { status: sessionError ? 400 : 401 });
  }

  if (!schoolId) {
    return NextResponse.json({ error: 'School ID is required.' }, { status: 400 });
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role, school_id')
    .eq('id', session.user.id)
    .single();

  if (profileError || !userProfile) {
    console.error("Profile fetch error:", profileError);
    return NextResponse.json({ error: profileError ? profileError.message : 'User profile not found or access denied.' }, { status: profileError ? 400 : 403 });
  }

  const isAdmin = ['super_admin', 'school_admin'].includes(userProfile.role);
  const isAuthorizedForSchool = userProfile.school_id === schoolId || userProfile.role === 'super_admin';

  if (!isAdmin || !isAuthorizedForSchool) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions or not authorized for this school.' }, { status: 403 });
  }

  const { data: settings, error: getError } = await supabase
    .from('system_settings')
    .select('*')
    .eq('school_id', schoolId);

  if (getError) {
    console.error("GET settings error:", getError);
    return NextResponse.json({ error: getError.message }, { status: 500 });
  }

  const formattedSettings = settings.reduce((acc, setting) => {
    acc[setting.setting_key] = setting.setting_value;
    return acc;
  }, {});

  return NextResponse.json(formattedSettings, { status: 200 });
}

export async function POST(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { schoolId } = params;

  // ... (similar auth and authorization logic as GET)

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ error: sessionError ? sessionError.message : 'Not authenticated.' }, { status: sessionError ? 400 : 401 });
  }

  if (!schoolId) {
    return NextResponse.json({ error: 'School ID is required.' }, { status: 400 });
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role, school_id')
    .eq('id', session.user.id)
    .single();

  if (profileError || !userProfile) {
    console.error("Profile fetch error:", profileError);
    return NextResponse.json({ error: profileError ? profileError.message : 'User profile not found or access denied.' }, { status: profileError ? 400 : 403 });
  }

  const isAdmin = ['super_admin', 'school_admin'].includes(userProfile.role);
  const isAuthorizedForSchool = userProfile.school_id === schoolId || userProfile.role === 'super_admin';

  if (!isAdmin || !isAuthorizedForSchool) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions or not authorized for this school.' }, { status: 403 });
  }

  const body = await request.json();
  const { settingKey, settingValue } = body;

  if (!settingKey || !settingValue) {
    return NextResponse.json({ error: 'Setting key and value are required.' }, { status: 400 });
  }

  const { data: updatedSetting, error: upsertError } = await supabase
    .from('system_settings')
    .upsert(
      {
        school_id: schoolId,
        setting_key: settingKey,
        setting_value: settingValue,
      },
      {
        onConflict: 'school_id, setting_key',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (upsertError) {
    console.error("POST settings upsert error:", upsertError);
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json(updatedSetting, { status: 200 });
}

// You'd also add DELETE, PUT/PATCH functions similarly for App Router
