package com.tt.reservation_salles;

import com.tt.reservation_salles.entities.Utilisateur;
import com.tt.reservation_salles.entities.Role;
import com.tt.reservation_salles.repositories.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class ReservationSallesApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReservationSallesApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (utilisateurRepository.findByEmail("admin@gmail.com").isEmpty()) {
				Utilisateur admin = new Utilisateur();
				admin.setNom("Admin");
				admin.setEmail("admin@gmail.com");
				admin.setMotDePasse(passwordEncoder.encode("adminadmin"));
				admin.setRole(Role.ADMIN);
				utilisateurRepository.save(admin);

				System.out.println("✅ Admin account created: admin@gmail.com / adminadmin");
			} else {
				System.out.println("ℹ️ Admin account already exists");
			}
		};
	}
}
