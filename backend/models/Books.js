const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true, min: 1, max: 5 } 
        }
    ],
    averageRating: { type: Number, default: 0 }
});


booksSchema.methods.calculateAverageRating = function() {
    if (this.ratings.length === 0) return 0;
    const totalRating = this.ratings.reduce((acc, rating) => acc + rating.grade, 0);
    this.averageRating = totalRating / this.ratings.length;
    return this.averageRating;
};

booksSchema.pre('save', function(next) {
    this.calculateAverageRating();
    next();
});

module.exports = mongoose.model("Books", booksSchema);



