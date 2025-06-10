---
layout: post
title:  Mean Field Theory of Random RNNs
categories: [sci, neuroscience]
excerpt: This is based on my presentation of Hannah Choi's group meeting on Fall semester. People in neuroscience know the key result yet few people actually went through the proofs. This doesn't look good to me. I should've written it up earlier but got too lazy to do it. But now here I am, on the flight to Taiwan, I got nothing else interesting to do besides watching black comedy 'Coming to America'. Perhaps it is the right time to finally do it.
---

There are many types of Recurrent Neural Networks (RNNs), LSTM is an RNN, torch.RNN is also an RNN. Basically as long as you have a bunch of neurons and they are recurrently connected to each other, you get an RNN.

In neuroscience, people are genuinely interested in a certain type of RNN

$$\tau \frac{dx}{dt} = -x +W\phi(x)+I$$

Think $x$ as an firing rate of a neuron (population), then $\phi(x)$ is its output (filtered by an activation function $\phi$ to avoid blowing everything up). $W$ is the connectivity matrix while $I$​ is the input vector. Personally I love this model, it's still of a simple form yet maintain the biological meaning. I would say it's the Ising model in neuroscience: surely it's oversimplified but still perseveres the foundamental feature. 

Nowadays people brutal-force train such RNNs (meaning you are training $W$) by back propagation to perform some cognitive task. But here, we focus on random RNN, which means $W$ is random. 

Of course random RNN cannot do shit, but it's still well intriguing since it shows some phase transitino behavior. Such random RNN could either be chaotic or falls to a dumb fixed point, depending on the average connectivity.

Let's take it more formally, say $W$ is Gaussian, $w_{ij}\approx N(0, g/\sqrt{N})$. We also let $I=0$. Then when $g<1$, the system drops to a fixed point where $x=0$. When $g>1$, the system experiences a chaotic phase. Like the plots below.

pretend there are plots here

What the fuck is going on here?

in 1988, our famous Haim Sponisky published a letter on PRL and elegently solved this problem, by applying Dynamic Mean Field Theory (DMFT).  And what is that? No worries, that's the goal of this blog. But before all the mono-jumbo of DMFT and neuroscience RNN, let's first take a look into Mean Field Theory (MFT).

#### Mean Field Theory (MFT)

Imagine a bunch of particles, and they are statistically identical. However, there are not ideal gas, they interact with each other. How to compute the states of a given *single* particle? Well, since $N\rightarrow \infty$ and they are statistically identical, you can think *other* particles are a statistically fixed background