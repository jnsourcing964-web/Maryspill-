// Booking System Module
class BookingSystem {
    constructor() {
        this.rooms = {
            'executive-suite': {
                name: 'Executive Suite',
                price: 120000,
                size: '65 m²',
                guests: 2,
                features: ['King Bed', 'Marble Bathroom', 'Rainforest Shower', 'Smart Controls']
            },
            'diplomatic-suite': {
                name: 'Diplomatic Suite',
                price: 180000,
                size: '95 m²',
                guests: 3,
                features: ['King + Sofa Bed', 'Private Dining', 'Executive Lounge', 'Bose System']
            },
            'penthouse': {
                name: 'The Merry Spill Penthouse',
                price: 350000,
                size: '220 m²',
                guests: 4,
                features: ['Two King Suites', 'Private Terrace', 'Butler Service', 'Home Theater']
            }
        };
        
        this.init();
    }

    init() {
        this.setupBookingWidget();
        this.setupRoomSelection();
        this.setupDatePickers();
        this.setupGuestCounter();
    }

    setupBookingWidget() {
        const bookingWidget = document.querySelector('.booking-widget');
        if (!bookingWidget) return;

        // Create booking form dynamically
        bookingWidget.innerHTML = this.createBookingForm();
        
        // Add event listeners
        this.addBookingFormListeners();
    }

    createBookingForm() {
        return `
            <form class="booking-form" id="mainBookingForm">
                <div class="booking-form-header">
                    <h3>Book Your Stay</h3>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="check-in">Check-in</label>
                        <input type="date" id="check-in" required>
                    </div>
                    <div class="form-group">
                        <label for="check-out">Check-out</label>
                        <input type="date" id="check-out" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="guests">Guests</label>
                        <div class="guest-selector">
                            <button type="button" class="guest-btn minus">-</button>
                            <input type="number" id="guests" value="2" min="1" max="4" readonly>
                            <button type="button" class="guest-btn plus">+</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="room-type">Room Type</label>
                        <select id="room-type" required>
                            <option value="executive-suite">Executive Suite</option>
                            <option value="diplomatic-suite">Diplomatic Suite</option>
                            <option value="penthouse">The Penthouse</option>
                        </select>
                    </div>
                </div>
                
                <div class="price-summary">
                    <div class="price-item">
                        <span>Room Rate:</span>
                        <span class="room-price">₦120,000</span>
                    </div>
                    <div class="price-item">
                        <span>Nights:</span>
                        <span class="nights-count">1</span>
                    </div>
                    <div class="price-item total">
                        <span>Total:</span>
                        <span class="total-price">₦120,000</span>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary">Check Availability</button>
            </form>
        `;
    }

    addBookingFormListeners() {
        const form = document.getElementById('mainBookingForm');
        if (!form) return;

        // Date change listeners
        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');
        
        if (checkInInput && checkOutInput) {
            checkInInput.addEventListener('change', () => this.updateBookingSummary());
            checkOutInput.addEventListener('change', () => this.updateBookingSummary());
        }

        // Room type change listener
        const roomTypeSelect = document.getElementById('room-type');
        if (roomTypeSelect) {
            roomTypeSelect.addEventListener('change', () => this.updateBookingSummary());
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processBooking();
        });
    }

    setupRoomSelection() {
        const roomCards = document.querySelectorAll('.room-card');
        
        roomCards.forEach(card => {
            card.addEventListener('click', () => {
                const roomId = card.dataset.roomId;
                if (roomId && this.rooms[roomId]) {
                    this.selectRoom(roomId);
                }
            });
        });
    }

    selectRoom(roomId) {
        const room = this.rooms[roomId];
        if (!room) return;

        // Update booking form
        const roomTypeSelect = document.getElementById('room-type');
        if (roomTypeSelect) {
            roomTypeSelect.value = roomId;
            this.updateBookingSummary();
        }

        // Scroll to booking widget
        const bookingWidget = document.querySelector('.booking-widget');
        if (bookingWidget) {
            bookingWidget.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupDatePickers() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');
        
        if (checkInInput) {
            checkInInput.min = today.toISOString().split('T')[0];
            checkInInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        if (checkOutInput) {
            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);
            
            checkOutInput.min = tomorrow.toISOString().split('T')[0];
            checkOutInput.value = dayAfterTomorrow.toISOString().split('T')[0];
        }
    }

    setupGuestCounter() {
        const guestInput = document.getElementById('guests');
        const minusBtn = document.querySelector('.guest-btn.minus');
        const plusBtn = document.querySelector('.guest-btn.plus');
        
        if (!guestInput || !minusBtn || !plusBtn) return;

        minusBtn.addEventListener('click', () => {
            let value = parseInt(guestInput.value);
            if (value > 1) {
                guestInput.value = value - 1;
                this.updateBookingSummary();
            }
        });

        plusBtn.addEventListener('click', () => {
            let value = parseInt(guestInput.value);
            if (value < 4) {
                guestInput.value = value + 1;
                this.updateBookingSummary();
            }
        });
    }

    updateBookingSummary() {
        const checkIn = document.getElementById('check-in');
        const checkOut = document.getElementById('check-out');
        const roomType = document.getElementById('room-type');
        const guests = document.getElementById('guests');
        
        if (!checkIn || !checkOut || !roomType || !guests) return;

        // Calculate nights
        const nights = this.calculateNights(checkIn.value, checkOut.value);
        
        // Get room price
        const room = this.rooms[roomType.value];
        if (!room) return;

        const roomPrice = room.price;
        const total = roomPrice * nights;

        // Update display
        const roomPriceElement = document.querySelector('.room-price');
        const nightsElement = document.querySelector('.nights-count');
        const totalElement = document.querySelector('.total-price');
        
        if (roomPriceElement) roomPriceElement.textContent = `₦${roomPrice.toLocaleString()}`;
        if (nightsElement) nightsElement.textContent = nights;
        if (totalElement) totalElement.textContent = `₦${total.toLocaleString()}`;
    }

    calculateNights(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    async processBooking() {
        const form = document.getElementById('mainBookingForm');
        if (!form) return;

        const formData = new FormData(form);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Validate dates
        if (new Date(bookingData['check-out']) <= new Date(bookingData['check-in'])) {
            this.showError('Check-out date must be after check-in date');
            return;
        }

        // Calculate total
        const nights = this.calculateNights(bookingData['check-in'], bookingData['check-out']);
        const room = this.rooms[bookingData['room-type']];
        const total = room.price * nights;

        // Show booking confirmation
        await this.showBookingConfirmation({
            ...bookingData,
            room: room.name,
            nights,
            total,
            roomPrice: room.price
        });
    }

    async showBookingConfirmation(booking) {
        // Create modal
        const modal = this.createConfirmationModal(booking);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Handle confirmation
        return new Promise((resolve) => {
            const confirmBtn = modal.querySelector('.confirm-booking');
            const cancelBtn = modal.querySelector('.cancel-booking');
            
            confirmBtn.addEventListener('click', async () => {
                try {
                    await this.finalizeBooking(booking);
                    modal.remove();
                    resolve(true);
                } catch (error) {
                    this.showError('Booking failed. Please try again.');
                    resolve(false);
                }
            });
            
            cancelBtn.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });
        });
    }

    createConfirmationModal(booking) {
        const modal = document.createElement('div');
        modal.className = 'booking-confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Confirm Your Booking</h3>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="booking-summary">
                        <div class="summary-item">
                            <span>Room:</span>
                            <span>${booking.room}</span>
                        </div>
                        <div class="summary-item">
                            <span>Check-in:</span>
                            <span>${this.formatDate(booking['check-in'])}</span>
                        </div>
                        <div class="summary-item">
                            <span>Check-out:</span>
                            <span>${this.formatDate(booking['check-out'])}</span>
                        </div>
                        <div class="summary-item">
                            <span>Guests:</span>
                            <span>${booking.guests}</span>
                        </div>
                        <div class="summary-item">
                            <span>Nights:</span>
                            <span>${booking.nights}</span>
                        </div>
                        <div class="summary-item">
                            <span>Nightly Rate:</span>
                            <span>₦${booking.roomPrice.toLocaleString()}</span>
                        </div>
                        <div class="summary-item total">
                            <span>Total Amount:</span>
                            <span>₦${booking.total.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="guest-details-form">
                        <h4>Guest Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <input type="text" placeholder="Full Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" placeholder="Email" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="tel" placeholder="Phone Number" required>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Special Requests" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-outline cancel-booking">Cancel</button>
                    <button class="btn btn-primary confirm-booking">Confirm & Pay</button>
                </div>
            </div>
        `;
        
        return modal;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async finalizeBooking(booking) {
        // In production, this would connect to your booking API
        // For now, we'll simulate the process
        
        const submitBtn = document.querySelector('.confirm-booking');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate booking reference
            const reference = `MS${Date.now().toString().slice(-8)}`;
            
            // Show success message
            this.showSuccess(
                `Booking confirmed! Your reference number is ${reference}. ` +
                `A confirmation email has been sent to you.`
            );
            
            // Reset form
            const form = document.getElementById('mainBookingForm');
            if (form) form.reset();
            this.setupDatePickers();
            this.updateBookingSummary();
            
            return reference;
            
        } catch (error) {
            this.showError('Payment processing failed. Please try again.');
            throw error;
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'booking-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #fee;
            color: #c00;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            animation: fadeIn 0.3s;
        `;
        
        const form = document.getElementById('mainBookingForm');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'booking-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        successDiv.style.cssText = `
            background: #efffef;
            color: #0a0;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: fadeIn 0.3s;
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(successDiv, container.firstChild);
            setTimeout(() => successDiv.remove(), 5000);
        }
    }
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.booking-widget') || document.querySelector('.room-card')) {
        new BookingSystem();
    }
});