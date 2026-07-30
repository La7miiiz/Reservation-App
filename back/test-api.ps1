$BASE = "http://localhost:8081/api"
$PWD = "adminadmin"
$EMAIL = "admin@gmail.com"

Write-Host "=== 1. Login as admin ===" -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -ContentType "application/json" -Body "{`"email`":`"$EMAIL`",`"motDePasse`":`"$PWD`"}" 
$token = $login.token
Write-Host "Token: $($token.Substring(0,20))..." -ForegroundColor Green
$headers = @{Authorization = "Bearer $token"}

Write-Host "`n=== 2. Get profile ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$BASE/auth/me" -Method GET -Headers $headers | ConvertTo-Json

Write-Host "`n=== 3. Signup new user ===" -ForegroundColor Cyan
$signup = try { Invoke-RestMethod -Uri "$BASE/auth/signup" -Method POST -ContentType "application/json" -Body "{`"nom`":`"Test User`",`"email`":`"test@test.com`",`"motDePasse`":`"test1234`"}" } catch { $_.Exception.Response.StatusCode.value__ }
Write-Host "Signup result: $signup"

Write-Host "`n=== 4. Blocked: no-token access to /me ===" -ForegroundColor Cyan
try { Invoke-RestMethod -Uri "$BASE/auth/me" -Method GET } catch { Write-Host "403/401 (expected): $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow }

Write-Host "`n=== 5. Create room ===" -ForegroundColor Cyan
$room = Invoke-RestMethod -Uri "$BASE/salles" -Method POST -ContentType "application/json" -Headers $headers -Body "{`"nom`":`"Salle A`",`"capacite`":10,`"description`":`"Main room`"}"
Write-Host "Room created: $($room.id) $($room.nom)" -ForegroundColor Green

Write-Host "`n=== 6. List rooms ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$BASE/salles" -Method GET -Headers $headers | ConvertTo-Json

Write-Host "`n=== 7. Create reservation ===" -ForegroundColor Cyan
$res = Invoke-RestMethod -Uri "$BASE/reservations" -Method POST -ContentType "application/json" -Headers $headers -Body "{`"nom`":`"Meeting`",`"dateDebut`":`"2026-07-30T09:00:00`",`"dateFin`":`"2026-07-30T10:00:00`",`"salleId`":$($room.id)}"
Write-Host "Reservation created: $($res.id) $($res.nom)" -ForegroundColor Green

Write-Host "`n=== 8. Conflict check: same time slot ===" -ForegroundColor Cyan
try { Invoke-RestMethod -Uri "$BASE/reservations" -Method POST -ContentType "application/json" -Headers $headers -Body "{`"nom`":`"Conflict`",`"dateDebut`":`"2026-07-30T09:00:00`",`"dateFin`":`"2026-07-30T10:00:00`",`"salleId`":$($room.id)}" } catch { Write-Host "Conflict detected (expected): $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow }

Write-Host "`n=== 9. List reservations ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$BASE/reservations" -Method GET -Headers $headers | ConvertTo-Json

Write-Host "`n=== 10. Update reservation (valid time change) ===" -ForegroundColor Cyan
$upd = Invoke-RestMethod -Uri "$BASE/reservations/$($res.id)" -Method PUT -ContentType "application/json" -Headers $headers -Body "{`"nom`":`"Updated Meeting`",`"dateDebut`":`"2026-07-30T11:00:00`",`"dateFin`":`"2026-07-30T12:00:00`",`"salleId`":$($room.id),`"statut`":`"ACTIVE`"}"
Write-Host "Updated: $($upd.nom)" -ForegroundColor Green

Write-Host "`n=== 11. Get admin stats ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$BASE/utilisateurs/admin/stats" -Method GET -Headers $headers | ConvertTo-Json

Write-Host "`n=== 12. Get admin logs ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$BASE/utilisateurs/logs" -Method GET -Headers $headers | ConvertTo-Json

Write-Host "`n=== 13. Get admin users ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$BASE/utilisateurs" -Method GET -Headers $headers | ConvertTo-Json

Write-Host "`n=== 14. Get admin all reservations ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$BASE/reservations" -Method GET -Headers $headers | ConvertTo-Json

Write-Host "`n=== 15. Update room ===" -ForegroundColor Cyan
$roomUpd = Invoke-RestMethod -Uri "$BASE/salles/$($room.id)" -Method PUT -ContentType "application/json" -Headers $headers -Body "{`"nom`":`"Salle A Updated`",`"capacite`":20,`"description`":`"Updated description`"}"
Write-Host "Updated room: $($roomUpd.nom) cap=$($roomUpd.capacite) desc=$($roomUpd.description)" -ForegroundColor Green

Write-Host "`n=== 16. Delete reservation ===" -ForegroundColor Cyan
try { Invoke-RestMethod -Uri "$BASE/reservations/$($res.id)" -Method DELETE -Headers $headers; Write-Host "Deleted" -ForegroundColor Green } catch { Write-Host "Delete error: $_" }

Write-Host "`n=== 17. Delete room ===" -ForegroundColor Cyan
try { Invoke-RestMethod -Uri "$BASE/salles/$($room.id)" -Method DELETE -Headers $headers; Write-Host "Deleted" -ForegroundColor Green } catch { Write-Host "Delete error: $_" }

Write-Host "`n=== ALL TESTS COMPLETE ===" -ForegroundColor Green
