# Guide de Déploiement des Cours sur Production

## ✅ Code poussé vers GitHub
Le script `seed_real_trading_courses.py` a été ajouté au repository.

## 🚀 Comment exécuter sur la production

### Étape 1 : Connexion à votre service de backend

Votre backend est déployé sur **Render.com** (selon votre `render.yaml`).

### Étape 2 : Exécuter le script de seed

**Option A - Via Render Shell (Recommandé) :**

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service backend
3. Cliquez sur l'onglet **"Shell"** en haut
4. Exécutez la commande :
   ```bash
   python seed_real_trading_courses.py
   ```

**Option B - Localement avec DATABASE_URL de production :**

1. Récupérez votre `DATABASE_URL` depuis Render :
   - Dashboard Render → Votre service → Environment
   - Copiez la valeur de `DATABASE_URL`

2. Dans votre terminal local :
   ```bash
   cd backend
   set DATABASE_URL=<votre-url-de-production>
   python seed_real_trading_courses.py
   ```

**Option C - Via API de Render :**

Vous pouvez aussi créer un endpoint temporaire dans votre backend pour déclencher le seed.

### Étape 3 : Vérification

Une fois exécuté, vous devriez voir :
```
[SUCCESS] Successfully added 6 professional trading courses with 54 lessons!
```

Puis rafraîchissez votre site web et allez dans **Académie** pour voir les nouveaux cours !

## 📋 Cours ajoutés

1. **Introduction au Trading - Les Fondamentaux** (2h30) - Débutant
2. **Analyse Technique Professionnelle** (4h) - Intermédiaire  
3. **Trading Forex : Stratégies Gagnantes** (5h30) - Intermédiaire
4. **Scalping et Day Trading : Profits Rapides** (3h45) - Avancé
5. **Money Management et Psychologie** (3h15) - Débutant
6. **Crypto Trading : Bitcoin et Altcoins** (4h20) - Intermédiaire

**Total : 54 leçons professionnelles avec quiz**

## ⚠️ Note Importante

⚠️ **Ce script supprime tous les cours existants** avant d'ajouter les nouveaux (ligne 12: `Course.query.delete()`).

Si vous voulez **ajouter** ces cours sans supprimer les existants, modifiez le script :
- Commentez la ligne 12 : `# Course.query.delete()`
- Ou supprimez cette ligne

## 🔄 Pour mettre à jour à l'avenir

Si vous voulez ajouter d'autres cours :
1. Modifiez `seed_real_trading_courses.py`
2. Push vers GitHub
3. Ré-exécutez le script sur Render

---
**Script créé le :** 2026-01-19  
**Localisation :** `backend/seed_real_trading_courses.py`
