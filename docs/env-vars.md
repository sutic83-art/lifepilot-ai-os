# Environment Variables

## Local development

DATABASE_URL  
Example:
`file:./dev.db`

NEXTAUTH_SECRET  
Long random string used for auth/session security.

NEXTAUTH_URL  
Example:
`http://localhost:3000`

OPENAI_API_KEY  
Used by AI Coach and future AI features.

## Notes

- Never commit real `.env` values.
- Keep `.env.example` as a safe template.
- Production will likely use a PostgreSQL `DATABASE_URL`.