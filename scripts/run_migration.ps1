# Ativar ambiente virtual e executar migration
& .\.venv\Scripts\Activate.ps1
cd backend
python manage.py migrate
python manage.py populate_universities
cd ..
Write-Host "✅ Migration e população de dados concluídas!"
