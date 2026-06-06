export function reportUiError({ scope = 'unknown', title, subtitle, meta } = {}) {
  const payload = {
    scope,
    title: title || 'UI error',
    subtitle: subtitle || '',
    meta: meta || null,
    timestamp: new Date().toISOString(),
  }

  // Centralized UI error reporting point. Swap this for Sentry/Datadog later.
  console.error('[AcadLink][UI_ERROR]', payload)
}
