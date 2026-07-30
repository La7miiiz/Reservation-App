package com.tt.reservation_salles.repositories;

import com.tt.reservation_salles.entities.Reservation;
import com.tt.reservation_salles.entities.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByDateFinBeforeAndStatut(LocalDateTime dateTime, StatutReservation statut);

    // 🔹 Toutes les réservations d’un utilisateur
    List<Reservation> findByUtilisateurId(Long utilisateurId);

    // 🔹 Triées par date de début décroissante
    List<Reservation> findByUtilisateurIdOrderByDateDebutDesc(Long utilisateurId);

    // 🔹 Filtrées aussi par statut
    List<Reservation> findByUtilisateurIdAndStatut(Long utilisateurId, StatutReservation statut);

    boolean existsBySalleIdAndStatutAndDateDebutBeforeAndDateFinAfter(
            Long salleId, StatutReservation statut, LocalDateTime dateFin, LocalDateTime dateDebut);

    // --- ADD THESE FOR STATS ---
    long countByStatut(StatutReservation statut);
}
